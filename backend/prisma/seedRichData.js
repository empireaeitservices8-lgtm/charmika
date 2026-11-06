const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedRichData() {
  console.log("Seeding comprehensive customers, addresses, orders, and status history...");

  const products = await prisma.product.findMany({ take: 6 });
  if (products.length === 0) {
    console.log("No products available.");
    return;
  }

  // 1. Seed at least 6 customers
  const customersData = [
    {
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      phone: "+91 98765 43210",
      status: "active",
      address: "Flat 402, Royal Residency, Indiranagar",
      city: "Bangalore",
      state: "Karnataka",
      postalCode: "560038",
    },
    {
      name: "Ananya Rao",
      email: "ananya.rao@example.com",
      phone: "+91 98123 45678",
      status: "active",
      address: "12/A, Temple View Enclave, T. Nagar",
      city: "Chennai",
      state: "Tamil Nadu",
      postalCode: "600017",
    },
    {
      name: "Meera Nair",
      email: "meera.nair@example.com",
      phone: "+91 97456 12345",
      status: "active",
      address: "Greenwood Avenue, Panampilly Nagar",
      city: "Kochi",
      state: "Kerala",
      postalCode: "682036",
    },
    {
      name: "Sneha Reddy",
      email: "sneha.reddy@example.com",
      phone: "+91 99887 76655",
      status: "active",
      address: "Road No. 10, Banjara Hills",
      city: "Hyderabad",
      state: "Telangana",
      postalCode: "500034",
    },
    {
      name: "Kavitha Menon",
      email: "kavitha.menon@example.com",
      phone: "+91 94471 23456",
      status: "active",
      address: "TC 15/201, Kowdiar Palace Road",
      city: "Thiruvananthapuram",
      state: "Kerala",
      postalCode: "695003",
    },
    {
      name: "Deepika Sundaram",
      email: "deepika.sundaram@example.com",
      phone: "+91 98400 11223",
      status: "active",
      address: "74, North Mada Street, Mylapore",
      city: "Chennai",
      state: "Tamil Nadu",
      postalCode: "600004",
    },
    {
      name: "Roshni Patel",
      email: "roshni.patel@example.com",
      phone: "+91 98250 99887",
      status: "inactive",
      address: "B-301, Heritage Towers, Bodakdev",
      city: "Ahmedabad",
      state: "Gujarat",
      postalCode: "380054",
    },
  ];

  const createdCustomers = [];
  for (const c of customersData) {
    const cust = await prisma.customer.upsert({
      where: { email: c.email },
      update: c,
      create: c,
    });
    createdCustomers.push(cust);

    // Add address
    await prisma.customerAddress.deleteMany({ where: { customerId: cust.id } });
    await prisma.customerAddress.create({
      data: {
        customerId: cust.id,
        fullName: cust.name,
        phone: cust.phone,
        addressLine1: cust.address || "Main Street",
        city: cust.city || "Bangalore",
        state: cust.state || "Karnataka",
        postalCode: cust.postalCode || "560001",
        country: "India",
        isDefault: true,
      },
    });
  }

  console.log(`✓ Seeded ${createdCustomers.length} customers with addresses.`);

  // 2. Seed at least 6 orders
  const ordersData = [
    {
      orderNumber: "CH-ORD-2026-001",
      customer: createdCustomers[0],
      prod: products[0],
      qty: 1,
      paymentMethod: "UPI",
      paymentStatus: "paid",
      orderStatus: "delivered",
      transactionId: "UPI-TXN-8829104",
      notes: "Please deliver between 10am and 1pm.",
      history: [
        { prevStatus: "pending", newStatus: "confirmed", comment: "Payment received via UPI" },
        { prevStatus: "confirmed", newStatus: "processing", comment: "Jewellery packed in velvet box" },
        { prevStatus: "processing", newStatus: "shipped", comment: "Dispatched via BlueDart AWB#882910" },
        { prevStatus: "shipped", newStatus: "delivered", comment: "Package delivered to customer" },
      ],
    },
    {
      orderNumber: "CH-ORD-2026-002",
      customer: createdCustomers[1],
      prod: products[1] || products[0],
      qty: 2,
      paymentMethod: "Card",
      paymentStatus: "paid",
      orderStatus: "processing",
      transactionId: "CARD-TXN-4412091",
      notes: "Gift wrap requested with bridal card message.",
      history: [
        { prevStatus: "pending", newStatus: "confirmed", comment: "Credit card payment verified" },
        { prevStatus: "confirmed", newStatus: "processing", comment: "Engraving customized details" },
      ],
    },
    {
      orderNumber: "CH-ORD-2026-003",
      customer: createdCustomers[2],
      prod: products[2] || products[0],
      qty: 1,
      paymentMethod: "NetBanking",
      paymentStatus: "paid",
      orderStatus: "shipped",
      transactionId: "NB-HDFC-9938120",
      notes: null,
      history: [
        { prevStatus: "pending", newStatus: "confirmed", comment: "NetBanking payment verified" },
        { prevStatus: "confirmed", newStatus: "shipped", comment: "Dispatched via DTDC courier" },
      ],
    },
    {
      orderNumber: "CH-ORD-2026-004",
      customer: createdCustomers[3],
      prod: products[3] || products[0],
      qty: 1,
      paymentMethod: "UPI",
      paymentStatus: "paid",
      orderStatus: "confirmed",
      transactionId: "UPI-GPAY-7729112",
      notes: "Call before delivery.",
      history: [
        { prevStatus: "pending", newStatus: "confirmed", comment: "Google Pay payment verified" },
      ],
    },
    {
      orderNumber: "CH-ORD-2026-005",
      customer: createdCustomers[4],
      prod: products[0],
      qty: 1,
      paymentMethod: "COD",
      paymentStatus: "pending",
      orderStatus: "pending",
      transactionId: null,
      notes: "Cash on delivery verification pending.",
      history: [
        { prevStatus: "none", newStatus: "pending", comment: "Order placed by customer via COD" },
      ],
    },
    {
      orderNumber: "CH-ORD-2026-006",
      customer: createdCustomers[5],
      prod: products[1] || products[0],
      qty: 1,
      paymentMethod: "Card",
      paymentStatus: "refunded",
      orderStatus: "cancelled",
      transactionId: "CARD-TXN-3319082",
      notes: "Customer requested cancellation before dispatch.",
      history: [
        { prevStatus: "pending", newStatus: "confirmed", comment: "Payment confirmed" },
        { prevStatus: "confirmed", newStatus: "cancelled", comment: "Cancelled upon customer request. Full refund initiated." },
      ],
    },
  ];

  for (const o of ordersData) {
    const unitPrice = Number(o.prod.salePrice ?? o.prod.regularPrice);
    const subtotal = unitPrice * o.qty;
    const totalAmount = subtotal;
    const shippingAddress = `${o.customer.name}, ${o.customer.address}, ${o.customer.city}, ${o.customer.state} - ${o.customer.postalCode}`;

    // Clean up existing order with this number if any
    const existing = await prisma.order.findUnique({ where: { orderNumber: o.orderNumber } });
    if (existing) {
      await prisma.orderStatusHistory.deleteMany({ where: { orderId: existing.id } });
      await prisma.orderItem.deleteMany({ where: { orderId: existing.id } });
      await prisma.order.delete({ where: { id: existing.id } });
    }

    const createdOrder = await prisma.order.create({
      data: {
        orderNumber: o.orderNumber,
        customerId: o.customer.id,
        customerPhone: o.customer.phone,
        subtotal,
        deliveryCharge: 0,
        tax: 0,
        discount: 0,
        totalAmount,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        transactionId: o.transactionId,
        orderStatus: o.orderStatus,
        stockDeducted: o.orderStatus !== "cancelled" && o.paymentStatus === "paid",
        shippingAddress,
        billingAddress: shippingAddress,
        customerNotes: o.notes,
        items: {
          create: [
            {
              productId: o.prod.id,
              productName: o.prod.name,
              sku: o.prod.sku,
              variant: o.prod.size || "Standard Size",
              jewelleryType: o.prod.jewelleryType || "Jewellery",
              productImage: o.prod.images?.[0]?.imageUrl || null,
              quantity: o.qty,
              unitPrice,
              subtotal,
            },
          ],
        },
      },
    });

    // Add status history
    for (const h of o.history) {
      await prisma.orderStatusHistory.create({
        data: {
          orderId: createdOrder.id,
          prevStatus: h.prevStatus,
          newStatus: h.newStatus,
          comment: h.comment,
          updatedBy: "Admin",
        },
      });
    }
  }

  console.log("✓ Seeded comprehensive orders with status history!");
}

seedRichData()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

