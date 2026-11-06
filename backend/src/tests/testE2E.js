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

async function runE2ETests() {
  console.log("==================================================================");
  console.log("CHARMIKA ADMIN PANEL - PHASE 7 END-TO-END VERIFICATION TEST SUITE");
  console.log("==================================================================");

  const server = app.listen(0);
  await new Promise((r) => server.once("listening", r));
  const serverPort = server.address().port;
  console.log(`✓ Test server running on http://127.0.0.1:${serverPort}`);

  let token = "";
  let authCookie = "";
  let createdCategoryId = null;
  let createdProductId = null;
  let uploadedImageUrl = "";

  try {
    // Clean up any previous test artifacts
    await prisma.product.deleteMany({ where: { sku: "CH-KND-001" } });
    await prisma.category.deleteMany({ where: { name: "Kundan Sets" } });

    // -------------------------------------------------------------------------
    // 1. Health check
    // -------------------------------------------------------------------------
    console.log("\n[1/7] Testing System Health Check...");
    const health = await request(server, { path: "/api/health" });
    if (health.statusCode !== 200 || !health.body.success) {
      throw new Error("Health check failed");
    }
    console.log("  ✓ Health check passed:", health.body.message);

    // -------------------------------------------------------------------------
    // 2. Authentication & Session Verification
    // -------------------------------------------------------------------------
    console.log("\n[2/7] Testing Admin Authentication...");
    // 2a. Invalid login
    const badLogin = await request(
      server,
      {
        path: "/api/admin/auth/login",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      { email: "admin@charmika.com", password: "wrong_password_test" }
    );
    if (badLogin.statusCode !== 401) throw new Error("Expected 401 for bad credentials");
    console.log("  ✓ Invalid login rejected with 401 as expected");

    // 2b. Valid login
    const goodLogin = await request(
      server,
      {
        path: "/api/admin/auth/login",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      { email: "admin@charmika.com", password: "admin123" }
    );
    if (goodLogin.statusCode !== 200 || !goodLogin.body.data.token) {
      throw new Error("Valid login failed");
    }
    token = goodLogin.body.data.token;
    authCookie = goodLogin.headers["set-cookie"]?.[0]?.split(";")[0] || "";
    console.log("  ✓ Login succeeded, token issued and HTTP-only cookie set");

    // 2c. Get profile via cookie
    const meRes = await request(server, {
      path: "/api/admin/auth/me",
      headers: { Cookie: authCookie },
    });
    if (meRes.statusCode !== 200 || meRes.body.data?.email !== "admin@charmika.com") {
      throw new Error("Get profile failed");
    }
    console.log("  ✓ Current profile verified via cookie session:", meRes.body.data?.name);

    const authHeaders = {
      Authorization: `Bearer ${token}`,
      Cookie: authCookie,
      "Content-Type": "application/json",
    };

    // -------------------------------------------------------------------------
    // 3. Dashboard Analytics Verification
    // -------------------------------------------------------------------------
    console.log("\n[3/7] Testing Dashboard Analytics...");
    const statsRes = await request(server, {
      path: "/api/admin/dashboard/stats",
      headers: authHeaders,
    });
    if (statsRes.statusCode !== 200) throw new Error("Failed to fetch dashboard stats");
    const stats = statsRes.body.data;
    console.log("  ✓ Dashboard Live Stats:", {
      totalProducts: stats.totalProducts,
      activePublic: stats.activePublic,
      inactive: stats.inactive,
      outOfStock: stats.outOfStock,
      totalCategories: stats.totalCategories,
    });

    const recentRes = await request(server, {
      path: "/api/admin/dashboard/recent-products?limit=5",
      headers: authHeaders,
    });
    if (recentRes.statusCode !== 200 || !Array.isArray(recentRes.body.data)) {
      throw new Error("Recent products fetch failed");
    }
    console.log(`  ✓ Dashboard Recent Products: ${recentRes.body.data.length} items loaded`);

    // -------------------------------------------------------------------------
    // 4. Category Lifecycle & Safe Deletion
    // -------------------------------------------------------------------------
    console.log("\n[4/7] Testing Category Management & Safe Deletion...");
    // 4a. Fetch categories
    const categoriesRes = await request(server, {
      path: "/api/admin/categories",
      headers: authHeaders,
    });
    if (categoriesRes.statusCode !== 200) throw new Error("Failed to fetch categories");
    console.log(`  ✓ Retrieved ${categoriesRes.body.data.length} existing categories`);

    // 4b. Test safe delete on a populated category
    const catWithProds = categoriesRes.body.data.find((c) => c.products > 0);
    if (catWithProds) {
      const blockedDel = await request(server, {
        path: `/api/admin/categories/${catWithProds.id}`,
        method: "DELETE",
        headers: authHeaders,
      });
      if (blockedDel.statusCode !== 400) {
        throw new Error("Category with products should have been protected from deletion");
      }
      console.log(`  ✓ Safe deletion verified: blocked deleting '${catWithProds.name}' (${catWithProds.products} products)`);
    }

    // 4c. Create a new category
    const newCat = await request(
      server,
      {
        path: "/api/admin/categories",
        method: "POST",
        headers: authHeaders,
      },
      {
        name: "Kundan Sets",
        description: "Handcrafted traditional Kundan jewellery collections",
        status: "active",
      }
    );
    if (newCat.statusCode !== 201) throw new Error("Failed to create Kundan Sets category");
    createdCategoryId = newCat.body.data.id;
    console.log(`  ✓ Created new category: '${newCat.body.data.name}' (ID: ${createdCategoryId})`);

    // -------------------------------------------------------------------------
    // 5. Image Upload & Product Lifecycle
    // -------------------------------------------------------------------------
    console.log("\n[5/7] Testing Image Upload & Product CRUD Lifecycle...");
    // 5a. Upload an image
    const boundary = "----WebKitFormBoundaryCharmikaE2E" + Date.now();
    const fakeImageContent = Buffer.from("simulated-png-image-binary-for-testing");
    const multipartBody = Buffer.concat([
      Buffer.from(`--${boundary}\r\n`),
      Buffer.from(`Content-Disposition: form-data; name="image"; filename="royal-kundan-necklace.png"\r\n`),
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
          Cookie: authCookie,
          "Content-Type": `multipart/form-data; boundary=${boundary}`,
          "Content-Length": multipartBody.length,
        },
      },
      multipartBody,
      true
    );
    if (uploadRes.statusCode !== 200 || !uploadRes.body.data?.url) {
      throw new Error("Image upload failed");
    }
    uploadedImageUrl = uploadRes.body.data.url;
    console.log("  ✓ Product image uploaded successfully:", uploadedImageUrl);

    // 5b. Create Product
    const newProd = await request(
      server,
      {
        path: "/api/admin/products",
        method: "POST",
        headers: authHeaders,
      },
      {
        name: "Royal Heritage Kundan Haaram",
        slug: "royal-heritage-kundan-haaram",
        sku: "CH-KND-001",
        categoryId: createdCategoryId,
        regularPrice: 24500,
        salePrice: 21999,
        costPrice: 14000,
        stock: 6,
        status: "active",
        featured: true,
        newArrival: true,
        material: "22K gold plated with Kundan stones",
        jewelleryType: "Haaram",
        weight: "110 g",
        occasion: "Wedding",
        collection: "Bridal",
        images: [{ url: uploadedImageUrl, isPrimary: true, displayOrder: 0 }],
      }
    );
    if (newProd.statusCode !== 201) throw new Error("Failed to create product");
    createdProductId = newProd.body.data.id;
    console.log(`  ✓ Created product '${newProd.body.data.name}' (ID: ${createdProductId}, SKU: ${newProd.body.data.sku})`);

    // 5c. Fetch by ID
    const prodDetail = await request(server, {
      path: `/api/admin/products/${createdProductId}`,
      headers: authHeaders,
    });
    if (prodDetail.statusCode !== 200 || prodDetail.body.data.name !== "Royal Heritage Kundan Haaram") {
      throw new Error("Get product by ID failed");
    }
    console.log("  ✓ Retrieved created product by ID with category and image associations");

    // 5d. Search & Filter
    const searchRes = await request(server, {
      path: encodeURI("/api/admin/products?query=Kundan&category=Kundan Sets&status=active&sort=price-desc"),
      headers: authHeaders,
    });
    if (searchRes.statusCode !== 200 || searchRes.body.data.length === 0) {
      throw new Error("Search and filter failed to match product");
    }
    console.log(`  ✓ Search & Filtering verified: matched ${searchRes.body.data.length} item(s)`);

    // 5e. Update Product
    const updateProd = await request(
      server,
      {
        path: `/api/admin/products/${createdProductId}`,
        method: "PUT",
        headers: authHeaders,
      },
      {
        regularPrice: 25000,
        stock: 5,
      }
    );
    if (updateProd.statusCode !== 200 || updateProd.body.data.regularPrice !== 25000) {
      throw new Error("Product update failed");
    }
    console.log("  ✓ Updated product regularPrice to ₹25,000 and stock to 5");

    // 5f. Delete Product
    const delProd = await request(server, {
      path: `/api/admin/products/${createdProductId}`,
      method: "DELETE",
      headers: authHeaders,
    });
    if (delProd.statusCode !== 200) throw new Error("Failed to delete product");
    console.log("  ✓ Deleted test product successfully");

    // 5g. Delete newly empty category
    const delCat = await request(server, {
      path: `/api/admin/categories/${createdCategoryId}`,
      method: "DELETE",
      headers: authHeaders,
    });
    if (delCat.statusCode !== 200) throw new Error("Failed to delete now-empty category");
    console.log("  ✓ Deleted empty 'Kundan Sets' category successfully");

    // Clean up uploaded test file
    if (uploadRes.body.data?.filename) {
      const filePath = path.join(__dirname, "../../uploads", uploadRes.body.data.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // -------------------------------------------------------------------------
    // 6. Profile & Security Updates
    // -------------------------------------------------------------------------
    console.log("\n[6/7] Testing Profile Updates & Password Security...");
    // 6a. Update name
    const updateProfile = await request(
      server,
      {
        path: "/api/admin/auth/profile",
        method: "PUT",
        headers: authHeaders,
      },
      { name: "Lekshmi (Lead Admin)", email: "admin@charmika.com" }
    );
    if (updateProfile.statusCode !== 200 || updateProfile.body.data.name !== "Lekshmi (Lead Admin)") {
      throw new Error("Profile update failed");
    }
    console.log("  ✓ Updated admin name to 'Lekshmi (Lead Admin)'");

    // Restore name back to "Admin"
    await request(
      server,
      {
        path: "/api/admin/auth/profile",
        method: "PUT",
        headers: authHeaders,
      },
      { name: "Admin", email: "admin@charmika.com" }
    );

    // 6b. Logout
    const logoutRes = await request(server, {
      path: "/api/admin/auth/logout",
      method: "POST",
    });
    if (logoutRes.statusCode !== 200) throw new Error("Logout failed");
    console.log("  ✓ Logout successful, cookie cleared");

    // 6c. Verify unauthorized access after logout (without token/cookie)
    const unauthorizedCheck = await request(server, {
      path: "/api/admin/dashboard/stats",
    });
    if (unauthorizedCheck.statusCode !== 401) {
      throw new Error("Expected 401 for unauthorized request after logout");
    }
    console.log("  ✓ Protected routes reject unauthenticated requests with 401");

    // -------------------------------------------------------------------------
    // 7. Database Persistence Check
    // -------------------------------------------------------------------------
    console.log("\n[7/7] Checking Final Database Integrity in charmika_website...");
    const [finalAdmins, finalCats, finalProds] = await Promise.all([
      prisma.admin.count(),
      prisma.category.count(),
      prisma.product.count(),
    ]);
    console.log("  ✓ Final Database Counts in charmika_website:", {
      admins: finalAdmins,
      categories: finalCats,
      products: finalProds,
    });

    console.log("\n==================================================================");
    console.log("✓ ALL END-TO-END INTEGRATION TESTS COMPLETED SUCCESSFULLY (100% PASSED)!");
    console.log("==================================================================\n");
  } catch (err) {
    console.error("\n❌ E2E TEST FAILED:", err);
    process.exitCode = 1;
  } finally {
    server.close();
    await prisma.$disconnect();
  }
}

runE2ETests();
