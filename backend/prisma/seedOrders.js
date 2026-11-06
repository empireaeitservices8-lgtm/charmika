const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedOrders() {
  console.log("Seeding customers and orders...");

  // 1. Ensure sample products exist
  const products = await prisma.product.findMany({ take: 5 });
  if (products.length === 0) {
    console.log("No products found to attach to orders.");
    return;
  }

  // 2. Seed Customers
  const customer1 = await prisma.customer.upsert({
    where: { email: "priya.sharma@example.com" },
    update: {},
    create: {
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      phone: "+91 98765 43210",
      status: "active",
      address: "Flat 402, Royal Residency, Indiranagar",
      city: "Bangalore",
      state: "Karnataka",
      postalCode: "560038",
    },
  });

  const customer2 = await prisma.customer.upsert({
    where: { email: "ananya.rao@example.com" },
    update: {},
    create: {
      name: "Ananya Rao",
      email: "ananya.rao@example.com",
      phone: "+91 98123 45678",
      status: "active",
      address: "12/A, Temple View Enclave, T. Nagar",
      city: "Chennai",
      state: "Tamil Nadu",
      postalCode: "600017",
    },
  });

  const customer3 = await prisma.customer.upsert({
    where: { email: "meera.nair@example.com" },
    update: {},
    create: {
      name: "Meera Nair",
      email: "meera.nair@example.com",
      phone: "+91 97456 12345",
      status: "active",
      address: "Greenwood Avenue, Panampilly Nagar",
      city: "Kochi",
      state: "Kerala",
      postalCode: "682036",
    },
  });

  // 3. Seed Orders
  const prod1 = products[0];
  const prod2 = products[1] || products[0];

  const order1 = await prisma.order.upsert({
    where: { orderNumber: "ORD-2026-1001" },
    update: {},
    create: {
      orderNumber: "ORD-2026-1001",
      customerId: customer1.id,
      subtotal: prod1.regularPrice,
      deliveryCharge: 0,
      tax: 0,
      discount: 0,
      totalAmount: prod1.regularPrice,
      paymentMethod: "UPI",
      paymentStatus: "paid",
      orderStatus: "confirmed",
      stockDeducted: true,
      shippingAddress: `${customer1.name}, ${customer1.address}, ${customer1.city}, ${customer1.state} - ${customer1.postalCode}`,
      items: {
        create: [
          {
            productId: prod1.id,
            productName: prod1.name,
            sku: prod1.sku,
            quantity: 1,
            unitPrice: prod1.regularPrice,
            subtotal: prod1.regularPrice,
          },
        ],
      },
    },
  });

  const order2Total = Number(prod2.regularPrice) * 2;
  const order2 = await prisma.order.upsert({
    where: { orderNumber: "ORD-2026-1002" },
    update: {},
    create: {
      orderNumber: "ORD-2026-1002",
      customerId: customer2.id,
      subtotal: order2Total,
      deliveryCharge: 150,
      tax: 0,
      discount: 0,
      totalAmount: order2Total + 150,
      paymentMethod: "Card",
      paymentStatus: "paid",
      orderStatus: "processing",
      stockDeducted: true,
      shippingAddress: `${customer2.name}, ${customer2.address}, ${customer2.city}, ${customer2.state} - ${customer2.postalCode}`,
      items: {
        create: [
          {
            productId: prod2.id,
            productName: prod2.name,
            sku: prod2.sku,
            quantity: 2,
            unitPrice: prod2.regularPrice,
            subtotal: order2Total,
          },
        ],
      },
    },
  });

  const order3 = await prisma.order.upsert({
    where: { orderNumber: "ORD-2026-1003" },
    update: {},
    create: {
      orderNumber: "ORD-2026-1003",
      customerId: customer3.id,
      subtotal: prod1.regularPrice,
      deliveryCharge: 0,
      tax: 0,
      discount: 0,
      totalAmount: prod1.regularPrice,
      paymentMethod: "COD",
      paymentStatus: "pending",
      orderStatus: "pending",
      stockDeducted: false,
      shippingAddress: `${customer3.name}, ${customer3.address}, ${customer3.city}, ${customer3.state} - ${customer3.postalCode}`,
      items: {
        create: [
          {
            productId: prod1.id,
            productName: prod1.name,
            sku: prod1.sku,
            quantity: 1,
            unitPrice: prod1.regularPrice,
            subtotal: prod1.regularPrice,
          },
        ],
      },
    },
  });

  console.log("✓ Customers & Orders seeded successfully!");
}

seedOrders()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

