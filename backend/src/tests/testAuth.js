const http = require("http");
require("dotenv").config({ path: __dirname + "/../../.env" });
const app = require("../app");

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

async function runTests() {
  const server = app.listen(0);
  await new Promise((r) => server.once("listening", r));
  console.log("Test server started on port", server.address().port);

  try {
    // 1. Invalid Login
    console.log("\n[Test 1] Login with invalid password...");
    const res1 = await request(
      server,
      {
        path: "/api/admin/auth/login",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      { email: "admin@charmika.com", password: "wrongpassword" }
    );
    console.log("Status:", res1.statusCode, "Message:", res1.body.message);
    if (res1.statusCode !== 401) throw new Error("Expected 401 for invalid login");

    // 2. Valid Login
    console.log("\n[Test 2] Login with valid credentials...");
    const res2 = await request(
      server,
      {
        path: "/api/admin/auth/login",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      { email: "admin@charmika.com", password: "admin123" }
    );
    console.log("Status:", res2.statusCode, "Success:", res2.body.success);
    if (res2.statusCode !== 200 || !res2.body.data.token) {
      throw new Error("Expected 200 and token for valid login");
    }
    const token = res2.body.data.token;
    const cookieHeader = res2.headers["set-cookie"]?.[0] || "";
    console.log("Set-Cookie returned:", cookieHeader.split(";")[0]);

    // 3. Unauthorized access to /me
    console.log("\n[Test 3] Access /me without authentication...");
    const res3 = await request(server, {
      path: "/api/admin/auth/me",
      method: "GET",
    });
    console.log("Status:", res3.statusCode, "Message:", res3.body.message);
    if (res3.statusCode !== 401) throw new Error("Expected 401 for unauthenticated access");

    // 4. Authorized access to /me using Cookie
    console.log("\n[Test 4] Access /me with HTTP-only cookie...");
    const res4 = await request(server, {
      path: "/api/admin/auth/me",
      method: "GET",
      headers: { Cookie: cookieHeader.split(";")[0] },
    });
    console.log("Status:", res4.statusCode, "Admin name:", res4.body.data?.name);
    if (res4.statusCode !== 200 || res4.body.data?.email !== "admin@charmika.com") {
      throw new Error("Expected 200 and admin data");
    }

    // 5. Authorized access to /me using Bearer header
    console.log("\n[Test 5] Access /me with Bearer token header...");
    const res5 = await request(server, {
      path: "/api/admin/auth/me",
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Status:", res5.statusCode, "Admin email:", res5.body.data?.email);
    if (res5.statusCode !== 200) throw new Error("Expected 200 for Bearer auth");

    // 6. Update Profile
    console.log("\n[Test 6] Update profile details...");
    const res6 = await request(
      server,
      {
        path: "/api/admin/auth/profile",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
      { name: "Lekshmi Admin", email: "admin@charmika.com" }
    );
    console.log("Status:", res6.statusCode, "Updated Name:", res6.body.data?.name);
    if (res6.statusCode !== 200 || res6.body.data?.name !== "Lekshmi Admin") {
      throw new Error("Expected 200 and updated name");
    }

    // 7. Change Password
    console.log("\n[Test 7] Change password with incorrect current password...");
    const res7 = await request(
      server,
      {
        path: "/api/admin/auth/change-password",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
      {
        currentPassword: "incorrectpassword",
        newPassword: "newsecretpassword123",
        confirmPassword: "newsecretpassword123",
      }
    );
    console.log("Status:", res7.statusCode, "Message:", res7.body.message);
    if (res7.statusCode !== 400) throw new Error("Expected 400 for incorrect current password");

    // 8. Logout
    console.log("\n[Test 8] Logout...");
    const res8 = await request(server, {
      path: "/api/admin/auth/logout",
      method: "POST",
    });
    console.log("Status:", res8.statusCode, "Message:", res8.body.message);
    const logoutCookie = res8.headers["set-cookie"]?.[0] || "";
    console.log("Cookie cleared:", logoutCookie.includes("Expires=") || logoutCookie.includes("Max-Age=0"));

    console.log("\n✓ ALL PHASE 4 AUTHENTICATION TESTS PASSED PERFECTLY!\n");
  } catch (err) {
    console.error("\nTEST SUITE FAILED:", err);
  } finally {
    server.close();
    const prisma = require("../config/db");
    // Restore default name
    await prisma.admin.update({
      where: { email: "admin@charmika.com" },
      data: { name: "Admin" },
    });
    await prisma.$disconnect();
  }
}

runTests();

