const http = require("http");
require("dotenv").config({ path: __dirname + "/../../.env" });
const app = require("../app");
const prisma = require("../config/db");

function request(server, options, body = null) {
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
      req.write(typeof body === "string" ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runInventoryTests() {
  console.log("==================================================================");
  console.log("CHARMIKA - AUTOMATIC INVENTORY & ORDERS/CUSTOMERS TEST SUITE");
  console.log("==================================================================");

  const server = app.listen(0);
  await new Promise((r) => server.once("listening", r));
  console.log("Test server listening on port:", server.address().port);

  let token = "";
  let testProductId = null;
  let testCustomerId = null;
  let order1Id = null;
  let order2Id = null;
  let order3Id = null;

  try {
    // 1. Admin Login
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
    console.log("✓ Authenticated as Admin successfully.");

    // Clean up any old test items
    const oldProducts = await prisma.product.findMany({ where: { sku: "TEST-INV-001" }, select: { id: true } });
    const oldProductIds = oldProducts.map(p => p.id);
    if (oldProductIds.length > 0) {
      await prisma.orderItem.deleteMany({ where: { productId: { in: oldProductIds } } });
      await prisma.order.deleteMany({ where: { items: { none: {} } } });
      await prisma.product.deleteMany({ where: { id: { in: oldProductIds } } });
    }
    await prisma.customer.deleteMany({ where: { email: "inv.tester@example.com" } });

    // 2. Create Product with initial stock = 4
    console.log("\n[Test 1] Creating product 'Grand Muhurtham Rental Set' with initial stock: 4...");
    const category = await prisma.category.findFirst();
    const prodRes = await request(
      server,
      {
        path: "/api/admin/products",
        method: "POST",
        headers: authHeaders,
      },
      {
        name: "Grand Muhurtham Rental Set",
        sku: "TEST-INV-001",
        categoryId: category.id,
        regularPrice: 5500,
        stock: 4,
        status: "active",
      }
    );
    if (prodRes.statusCode !== 201) throw new Error("Failed to create product");
    testProductId = prodRes.body.data.id;
    console.log(`  ✓ Product created (ID: ${testProductId}). Initial Stock: ${prodRes.body.data.stock}, Status: ${prodRes.body.data.stockStatus}`);
    if (prodRes.body.data.stock !== 4 || prodRes.body.data.stockStatus !== "in_stock") {
      throw new Error("Expected initial stock 4 and in_stock status");
    }

    // 3. Create a test customer
    const cust = await prisma.customer.create({
      data: {
        name: "Inventory Test Customer",
        email: "inv.tester@example.com",
        phone: "+91 99999 88888",
      },
    });
    testCustomerId = cust.id;

    // 4. Customer 1 purchases 1 unit (Order 1 - Confirmed)
    console.log("\n[Test 2] Customer 1 purchases 1 unit (Order confirmed)...");
    const ord1Res = await request(
      server,
      {
        path: "/api/admin/orders",
        method: "POST",
        headers: authHeaders,
      },
      {
        customerId: testCustomerId,
        orderStatus: "confirmed",
        paymentStatus: "paid",
        items: [{ productId: testProductId, quantity: 1 }],
      }
    );
    if (ord1Res.statusCode !== 201) throw new Error("Order 1 creation failed: " + ord1Res.body.message);
    order1Id = ord1Res.body.data.id;

    const prodAfter1 = await prisma.product.findUnique({ where: { id: testProductId } });
    console.log(`  ✓ Order 1 created. Product Stock is now: ${prodAfter1.stock} (Expected: 3)`);
    if (prodAfter1.stock !== 3) throw new Error("Expected stock 3 after 1st purchase");

    // 5. Customer 2 purchases 2 units (Order 2 - Confirmed)
    console.log("\n[Test 3] Customer 2 purchases 2 units (Order confirmed)...");
    const ord2Res = await request(
      server,
      {
        path: "/api/admin/orders",
        method: "POST",
        headers: authHeaders,
      },
      {
        customerId: testCustomerId,
        orderStatus: "confirmed",
        paymentStatus: "paid",
        items: [{ productId: testProductId, quantity: 2 }],
      }
    );
    if (ord2Res.statusCode !== 201) throw new Error("Order 2 creation failed");
    order2Id = ord2Res.body.data.id;

    const prodAfter2 = await prisma.product.findUnique({ where: { id: testProductId } });
    console.log(`  ✓ Order 2 created. Product Stock is now: ${prodAfter2.stock} (Expected: 1)`);
    if (prodAfter2.stock !== 1) throw new Error("Expected stock 1 after 2nd purchase");

    // 6. Customer 3 purchases 1 unit (Order 3 - Confirmed) -> Stock reaches 0
    console.log("\n[Test 4] Customer 3 purchases remaining 1 unit -> Stock reaches 0 (Out of Stock)...");
    const ord3Res = await request(
      server,
      {
        path: "/api/admin/orders",
        method: "POST",
        headers: authHeaders,
      },
      {
        customerId: testCustomerId,
        orderStatus: "confirmed",
        paymentStatus: "paid",
        items: [{ productId: testProductId, quantity: 1 }],
      }
    );
    if (ord3Res.statusCode !== 201) throw new Error("Order 3 creation failed");
    order3Id = ord3Res.body.data.id;

    const prodAfter3 = await request(server, {
      path: `/api/admin/products/${testProductId}`,
      headers: authHeaders,
    });
    console.log(`  ✓ Order 3 created. Product Stock is now: ${prodAfter3.body.data.stock}, Status: ${prodAfter3.body.data.stockStatus}`);
    if (prodAfter3.body.data.stock !== 0 || prodAfter3.body.data.stockStatus !== "out_of_stock") {
      throw new Error("Expected stock 0 and out_of_stock status");
    }

    // 7. Attempt purchase when stock is 0 (Must be REJECTED)
    console.log("\n[Test 5] Attempting purchase when stock is 0 (Expect rejection)...");
    const rejectedOrd = await request(
      server,
      {
        path: "/api/admin/orders",
        method: "POST",
        headers: authHeaders,
      },
      {
        customerId: testCustomerId,
        orderStatus: "confirmed",
        paymentStatus: "paid",
        items: [{ productId: testProductId, quantity: 1 }],
      }
    );
    console.log(`  ✓ Status: ${rejectedOrd.statusCode}, Message: ${rejectedOrd.body.message}`);
    if (rejectedOrd.statusCode !== 500 && rejectedOrd.statusCode !== 400) {
      throw new Error("Expected order rejection due to insufficient stock");
    }

    // 8. Cancel Order 3 -> Stock restored from 0 to 1
    console.log("\n[Test 6] Cancelling Order 3 -> Stock must restore automatically from 0 to 1...");
    const cancelRes = await request(
      server,
      {
        path: `/api/admin/orders/${order3Id}/status`,
        method: "PUT",
        headers: authHeaders,
      },
      { orderStatus: "cancelled" }
    );
    if (cancelRes.statusCode !== 200) throw new Error("Cancel order failed: " + cancelRes.body.message);

    const prodAfterCancel = await request(server, {
      path: `/api/admin/products/${testProductId}`,
      headers: authHeaders,
    });
    console.log(`  ✓ Order 3 cancelled. Restored stock: ${prodAfterCancel.body.data.stock}, Status: ${prodAfterCancel.body.data.stockStatus}`);
    if (prodAfterCancel.body.data.stock !== 1 || prodAfterCancel.body.data.stockStatus !== "in_stock") {
      throw new Error("Expected stock restored to 1 and status in_stock");
    }

    // 9. Attempt duplicate cancellation (Stock must NOT be restored twice!)
    console.log("\n[Test 7] Cancelling already-cancelled order again (Stock must NOT increment again)...");
    await request(
      server,
      {
        path: `/api/admin/orders/${order3Id}/status`,
        method: "PUT",
        headers: authHeaders,
      },
      { orderStatus: "cancelled" }
    );
    const prodAfterDoubleCancel = await prisma.product.findUnique({ where: { id: testProductId } });
    console.log(`  ✓ Stock after duplicate cancellation: ${prodAfterDoubleCancel.stock} (Still 1 - Passed!)`);
    if (prodAfterDoubleCancel.stock !== 1) {
      throw new Error("Stock was incorrectly incremented twice upon duplicate cancellation");
    }

    // 10. Verify Customer APIs
    console.log("\n[Test 8] Testing Customer APIs...");
    const custList = await request(server, {
      path: "/api/admin/customers?query=Inventory",
      headers: authHeaders,
    });
    console.log(`  ✓ Customers list query: found ${custList.body.data?.length} customer(s)`);
    if (custList.statusCode !== 200 || custList.body.data.length === 0) {
      throw new Error("Customer query failed");
    }

    const custDetail = await request(server, {
      path: `/api/admin/customers/${testCustomerId}`,
      headers: authHeaders,
    });
    console.log(`  ✓ Customer details loaded. Lifetime Orders: ${custDetail.body.data.totalOrders}, Spending: ₹${custDetail.body.data.totalSpending}`);
    if (custDetail.statusCode !== 200 || custDetail.body.data.totalOrders < 3) {
      throw new Error("Customer details orders aggregation failed");
    }

    // Clean up test data
    console.log("\nCleaning up test orders, customer, and product...");
    await prisma.orderItem.deleteMany({
      where: { orderId: { in: [order1Id, order2Id, order3Id] } },
    });
    await prisma.order.deleteMany({
      where: { id: { in: [order1Id, order2Id, order3Id] } },
    });
    await prisma.product.delete({ where: { id: testProductId } });
    await prisma.customer.delete({ where: { id: testCustomerId } });

    console.log("\n==================================================================");
    console.log("✓ ALL AUTOMATIC INVENTORY & ORDERS/CUSTOMERS TESTS PASSED (100%)!");
    console.log("==================================================================\n");
  } catch (err) {
    console.error("\n❌ INVENTORY TEST FAILED:", err);
    process.exitCode = 1;
  } finally {
    server.close();
    await prisma.$disconnect();
  }
}

runInventoryTests();
