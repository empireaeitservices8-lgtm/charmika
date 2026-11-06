require("dotenv").config({ path: __dirname + "/../../.env" });
const prisma = require("./db");

async function testConnection() {
  try {
    console.log("Connecting to:", process.env.DATABASE_URL?.replace(/:([^:@]+)@/, ":****@"));
    await prisma.$connect();
    console.log("SUCCESS: Successfully connected to MySQL database charmika_website!");
    const tables = await prisma.$queryRawUnsafe("SHOW TABLES;");
    console.log("Current tables in charmika_website:", tables);

    const admins = await prisma.admin.count();
    const categories = await prisma.category.count();
    const products = await prisma.product.count();
    console.log("ROW COUNTS:", { admins, categories, products });

    return true;
  } catch (err) {
    console.error("CONNECTION_ERROR:", err.message);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  testConnection();
}

module.exports = testConnection;
