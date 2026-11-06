const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // 1. Seed Admin
  const adminEmail = "admin@charmika.com";
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("admin123", 10);
    const admin = await prisma.admin.create({
      data: {
        name: "Admin",
        email: adminEmail,
        passwordHash,
        role: "ADMIN",
        isActive: true,
      },
    });
    console.log(`✓ Admin created: ${admin.email} (default password: admin123)`);
  } else {
    console.log(`- Admin already exists: ${existingAdmin.email}`);
  }

  // 2. Seed Categories
  const initialCategories = [
    { name: "Chokers", slug: "chokers", description: "Statement chokers and short necklaces", status: "ACTIVE" },
    { name: "Haarams", slug: "haarams", description: "Long traditional haarams and mala sets", status: "ACTIVE" },
    { name: "Nakshi", slug: "nakshi", description: "Nakshi temple jewellery", status: "ACTIVE" },
    { name: "Rentals", slug: "rentals", description: "Bridal and occasion rental sets", status: "ACTIVE" },
    { name: "Bangles", slug: "bangles", description: "Bangles and kada sets", status: "INACTIVE" },
  ];

  for (const cat of initialCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("✓ Categories seeded successfully");

  // 3. Seed Initial Products (from mockData)
  const categoryRecords = await prisma.category.findMany();
  const catMap = {};
  categoryRecords.forEach((c) => {
    catMap[c.name] = c.id;
  });

  const initialProducts = [
    {
      name: "Antique Gold Haaram",
      slug: "antique-gold-haaram",
      sku: "CH-HAR-001",
      categoryName: "Haarams",
      regularPrice: 12500,
      salePrice: 10900,
      costPrice: 6800,
      stock: 8,
      status: "ACTIVE",
      featured: true,
      newArrival: true,
      shortDescription: "Traditional antique gold finish haaram.",
      description: "A long temple-style haaram with an antique gold finish, ideal for weddings and festive occasions.",
      material: "Antique gold plated",
      jewelleryType: "Haaram",
      weight: "85 g",
      size: "Free size",
      colour: "Gold",
      occasion: "Wedding",
      collection: "Bridal",
      tags: "haaram, temple, bridal",
    },
    {
      name: "Kemp Stone Choker",
      slug: "kemp-stone-choker",
      sku: "CH-CHK-014",
      categoryName: "Chokers",
      regularPrice: 7800,
      salePrice: null,
      stock: 0,
      status: "ACTIVE",
      featured: false,
      newArrival: true,
      shortDescription: "Red kemp stone choker.",
      description: "Handcrafted choker set with red kemp stones and a matching pair of earrings.",
      material: "Brass with kemp stones",
      jewelleryType: "Choker",
      weight: "52 g",
      size: "Free size",
      colour: "Red & Gold",
      occasion: "Festive",
      collection: "Women",
      tags: "choker, kemp",
    },
    {
      name: "Nakshi Temple Necklace",
      slug: "nakshi-temple-necklace",
      sku: "CH-NAK-007",
      categoryName: "Nakshi",
      regularPrice: 15200,
      salePrice: 13500,
      stock: 4,
      status: "INACTIVE",
      featured: true,
      newArrival: false,
      material: "Gold plated",
      jewelleryType: "Necklace",
    },
    {
      name: "Bridal Rental Set",
      slug: "bridal-rental-set",
      sku: "CH-RNT-003",
      categoryName: "Rentals",
      regularPrice: 4500,
      salePrice: null,
      stock: 12,
      status: "ACTIVE",
      featured: false,
      newArrival: false,
      material: "Mixed alloy",
      jewelleryType: "Full Set",
    },
    {
      name: "Pearl Layered Choker",
      slug: "pearl-layered-choker",
      sku: "CH-CHK-021",
      categoryName: "Chokers",
      regularPrice: 6200,
      salePrice: 5400,
      stock: 3,
      status: "ACTIVE",
      featured: false,
      newArrival: true,
      jewelleryType: "Choker",
    },
    {
      name: "Long Kasu Mala",
      slug: "long-kasu-mala",
      sku: "CH-HAR-009",
      categoryName: "Haarams",
      regularPrice: 9800,
      salePrice: null,
      stock: 15,
      status: "ACTIVE",
      featured: true,
      newArrival: false,
      jewelleryType: "Haaram",
    },
  ];

  for (const prod of initialProducts) {
    const { categoryName, ...productData } = prod;
    const categoryId = catMap[categoryName] || categoryRecords[0].id;
    await prisma.product.upsert({
      where: { sku: prod.sku },
      update: {},
      create: {
        ...productData,
        categoryId,
      },
    });
  }
  console.log("✓ Initial products seeded successfully");
  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

