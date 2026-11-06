const http = require("http");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: __dirname + "/../../.env" });
const app = require("../app");
const prisma = require("../config/db");

function request(server, options, body = null, isMultipart = false) {
  return new Promise((resolve, reject) => {
    const port = server.address().port;
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port,
        path: options.path,
        method: options.method || "GET",
        headers: options.headers || {},
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          let json = null;
          try {
            json = JSON.parse(data);
          } catch (e) {
            json = data;
          }
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: json,
          });
        });
      }
    );
    req.on("error", reject);
    if (body) {
      if (isMultipart || Buffer.isBuffer(body)) {
        req.write(body);
      } else {
        req.write(typeof body === "string" ? body : JSON.stringify(body));
      }
    }
    req.end();
  });
}

async function runModuleTests() {
  const server = app.listen(0);
  await new Promise((r) => server.once("listening", r));
  console.log("Modules test server running on port:", server.address().port);

  let token = "";

  try {
    // Step 0: Login to obtain auth token
    const loginRes = await request(
      server,
      {
        path: "/api/admin/auth/login",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      { email: "admin@charmika.com", password: "admin123" }
    );
    token = loginRes.body.data.token;
    const authHeaders = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    console.log("✓ Logged in as Admin successfully.");

    // 1. Dashboard Stats Test
    console.log("\n[Test 1] Testing Dashboard Stats API...");
    const statsRes = await request(server, {
      path: "/api/admin/dashboard/stats",
      headers: authHeaders,
    });
    console.log("Stats Status:", statsRes.statusCode, statsRes.body.data);
    if (statsRes.statusCode !== 200 || typeof statsRes.body.data.totalProducts !== "number") {
      throw new Error("Stats endpoint failed");
    }

    // 2. Dashboard Recent Products
    console.log("\n[Test 2] Testing Dashboard Recent Products API...");
    const recentRes = await request(server, {
      path: "/api/admin/dashboard/recent-products?limit=4",
      headers: authHeaders,
    });
    console.log("Recent Count:", recentRes.body.data?.length);
    if (recentRes.statusCode !== 200 || !Array.isArray(recentRes.body.data)) {
      throw new Error("Recent products endpoint failed");
    }

    // 3. Category List & Safe Delete
    console.log("\n[Test 3] Testing Categories API...");
    const catListRes = await request(server, {
      path: "/api/admin/categories",
      headers: authHeaders,
    });
    console.log("Categories Count:", catListRes.body.data?.length);
    if (catListRes.statusCode !== 200 || catListRes.body.data.length === 0) {
      throw new Error("Failed to retrieve categories");
    }

    // Try deleting a category that has products (should be blocked)
    const categoryWithProducts = catListRes.body.data.find((c) => c.products > 0);
    if (categoryWithProducts) {
      console.log(`Testing Safe Delete on '${categoryWithProducts.name}' (has ${categoryWithProducts.products} products)...`);
      const deleteBlockedRes = await request(server, {
        path: `/api/admin/categories/${categoryWithProducts.id}`,
        method: "DELETE",
        headers: authHeaders,
      });
      console.log("Safe Delete blocked as expected. Status:", deleteBlockedRes.statusCode, "Message:", deleteBlockedRes.body.message);
      if (deleteBlockedRes.statusCode !== 400) {
        throw new Error("Expected 400 when attempting to delete category with products");
      }
    }

    // Create a new test category and delete it
    console.log("Creating new category 'Silver Pendants'...");
    const newCatRes = await request(
      server,
      {
        path: "/api/admin/categories",
        method: "POST",
        headers: authHeaders,
      },
      { name: "Silver Pendants", description: "Silver handcrafted pendants", status: "active" }
    );
    console.log("Category Created:", newCatRes.body.data?.name, "ID:", newCatRes.body.data?.id);
    const testCatId = newCatRes.body.data.id;

    console.log("Deleting empty test category...");
    const deleteAllowedRes = await request(server, {
      path: `/api/admin/categories/${testCatId}`,
      method: "DELETE",
      headers: authHeaders,
    });
    console.log("Delete Empty Category Status:", deleteAllowedRes.statusCode, "Message:", deleteAllowedRes.body.message);
    if (deleteAllowedRes.statusCode !== 200) {
      throw new Error("Failed to delete empty category");
    }

    // 4. Products List with Filters & Pagination
    console.log("\n[Test 4] Testing Products List API (pagination, search, filters)...");
    const prodListRes = await request(server, {
      path: "/api/admin/products?page=1&limit=5&category=Haarams&sort=newest",
      headers: authHeaders,
    });
    console.log("Products Count:", prodListRes.body.data?.length, "Total:", prodListRes.body.pagination?.total);
    if (prodListRes.statusCode !== 200 || !prodListRes.body.pagination) {
      throw new Error("Products listing endpoint failed");
    }

    // 5. Create Product CRUD
    console.log("\n[Test 5] Testing Product Creation & Updates...");
    const newProdRes = await request(
      server,
      {
        path: "/api/admin/products",
        method: "POST",
        headers: authHeaders,
      },
      {
        name: "Emerald Green Temple Choker",
        sku: "CH-TST-999",
        category: "Chokers",
        regularPrice: 8900,
        salePrice: 7999,
        stock: 10,
        status: "active",
        material: "Brass with emerald stone",
        jewelleryType: "Choker",
        images: [{ url: "https://example.com/choker1.jpg", isPrimary: true, displayOrder: 0 }],
      }
    );
    console.log("Create Product Status:", newProdRes.statusCode, "Created ID:", newProdRes.body.data?.id);
    if (newProdRes.statusCode !== 201) throw new Error("Product creation failed");
    const testProdId = newProdRes.body.data.id;

    // Fetch by ID
    const getByIdRes = await request(server, {
      path: `/api/admin/products/${testProdId}`,
      headers: authHeaders,
    });
    console.log("Get Product By ID Status:", getByIdRes.statusCode, "Name:", getByIdRes.body.data?.name);
    if (getByIdRes.statusCode !== 200 || getByIdRes.body.data?.name !== "Emerald Green Temple Choker") {
      throw new Error("Get Product by ID failed");
    }

    // Update Product
    const updateProdRes = await request(
      server,
      {
        path: `/api/admin/products/${testProdId}`,
        method: "PUT",
        headers: authHeaders,
      },
      {
        regularPrice: 9500,
        stock: 15,
      }
    );
    console.log("Update Product Status:", updateProdRes.statusCode, "Updated Price:", updateProdRes.body.data?.regularPrice);
    if (updateProdRes.statusCode !== 200 || updateProdRes.body.data?.regularPrice !== 9500) {
      throw new Error("Product update failed");
    }

    // Delete Product
    const deleteProdRes = await request(server, {
      path: `/api/admin/products/${testProdId}`,
      method: "DELETE",
      headers: authHeaders,
    });
    console.log("Delete Product Status:", deleteProdRes.statusCode, "Message:", deleteProdRes.body.message);
    if (deleteProdRes.statusCode !== 200) throw new Error("Product deletion failed");

    // 6. Image Upload Test (Multipart Form-Data)
    console.log("\n[Test 6] Testing Image Upload (Multipart)...");
    const boundary = "----WebKitFormBoundaryCharmikaTest" + Date.now();
    const fakeImageContent = Buffer.from("fake-png-image-binary-data-for-testing");
    const multipartBody = Buffer.concat([
      Buffer.from(`--${boundary}\r\n`),
      Buffer.from(`Content-Disposition: form-data; name="image"; filename="sample-jewellery.png"\r\n`),
      Buffer.from(`Content-Type: image/png\r\n\r\n`),
      fakeImageContent,
      Buffer.from(`\r\n--${boundary}--\r\n`),
    ]);

    const uploadRes = await request(
      server,
      {
        path: "/api/admin/upload",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": `multipart/form-data; boundary=${boundary}`,
          "Content-Length": multipartBody.length,
        },
      },
      multipartBody,
      true
    );
    console.log("Upload Status:", uploadRes.statusCode, "Upload URL:", uploadRes.body.data?.url);
    if (uploadRes.statusCode !== 200 || !uploadRes.body.data?.url) {
      throw new Error("Upload endpoint failed");
    }

    // Clean up uploaded test file
    if (uploadRes.body.data?.filename) {
      const filePath = path.join(__dirname, "../../uploads", uploadRes.body.data.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    console.log("\n✓ ALL PHASE 5 BACKEND MODULE TESTS PASSED PERFECTLY!\n");
  } catch (err) {
    console.error("\nTEST SUITE FAILED:", err);
  } finally {
    server.close();
    await prisma.$disconnect();
  }
}

runModuleTests();

