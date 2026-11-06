const prisma = require("../config/db");
const { deductOrderStock, restoreOrderStock } = require("../services/inventory.service");

function formatDate(date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatOrder(o) {
  return {
    id: o.id,
    orderNumber: o.orderNumber,
    customerId: o.customerId,
    customerName: o.customer?.name || "Customer",
    customerEmail: o.customer?.email || "",
    customerPhone: o.customer?.phone || "",
    customerStatus: o.customer?.status || "active",
    subtotal: Number(o.subtotal),
    deliveryCharge: Number(o.deliveryCharge),
    tax: Number(o.tax),
    discount: Number(o.discount),
    totalAmount: Number(o.totalAmount),
    paymentMethod: o.paymentMethod,
    paymentStatus: o.paymentStatus,
    orderStatus: o.orderStatus,
    stockDeducted: o.stockDeducted,
    shippingAddress: o.shippingAddress || "",
    billingAddress: o.billingAddress || o.shippingAddress || "",
    customerNotes: o.customerNotes || "",
    couponCode: o.couponCode || null,
    transactionId: o.transactionId || null,
    itemsCount: o.items ? o.items.reduce((acc, i) => acc + i.quantity, 0) : 0,
    items: (o.items || []).map((i) => ({
      id: i.id,
      productId: i.productId,
      productName: i.productName || i.product?.name || "Product",
      sku: i.sku || i.product?.sku || "",
      variant: i.variant || "Standard Size",
      jewelleryType: i.jewelleryType || i.product?.jewelleryType || "Jewellery",
      productImage: i.productImage || i.product?.images?.[0]?.imageUrl || null,
      quantity: i.quantity,
      unitPrice: Number(i.unitPrice),
      subtotal: Number(i.subtotal),
      currentStock: i.product?.stock ?? null,
    })),
    statusHistory: (o.statusHistory || []).map((h) => ({
      id: h.id,
      prevStatus: h.prevStatus,
      newStatus: h.newStatus,
      comment: h.comment || "",
      updatedBy: h.updatedBy || "Admin",
      date: formatDate(h.createdAt),
    })),
    createdAt: o.createdAt,
    formattedDate: formatDate(o.createdAt),
    updatedAt: o.updatedAt,
    formattedUpdatedAt: formatDate(o.updatedAt),
  };
}

/**
 * GET /api/admin/orders
 */
async function getOrders(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const { query, orderStatus, paymentStatus } = req.query;

    const where = {};

    if (query && query.trim()) {
      const q = query.trim();
      where.OR = [
        { orderNumber: { contains: q } },
        { customer: { name: { contains: q } } },
        { customer: { email: { contains: q } } },
      ];
    }

    if (orderStatus && orderStatus !== "all") {
      where.orderStatus = orderStatus.toLowerCase();
    }

    if (paymentStatus && paymentStatus !== "all") {
      where.paymentStatus = paymentStatus.toLowerCase();
    }

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          customer: true,
          items: {
            include: {
              product: {
                include: {
                  images: { where: { isPrimary: true }, take: 1 },
                },
              },
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return res.json({
      success: true,
      message: "Orders retrieved successfully.",
      data: orders.map(formatOrder),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/orders/:id
 */
async function getOrderById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid order ID." });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        statusHistory: { orderBy: { createdAt: "desc" } },
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    return res.json({
      success: true,
      message: "Order details retrieved successfully.",
      data: formatOrder(order),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/admin/orders/:id/status
 * Updates order status and triggers automatic stock management.
 */
async function updateOrderStatus(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid order ID." });
    }

    const { orderStatus, paymentStatus } = req.body;
    const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

    if (orderStatus && !validStatuses.includes(orderStatus.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Allowed: ${validStatuses.join(", ")}`,
      });
    }

    const currentOrder = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!currentOrder) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    const targetStatus = orderStatus ? orderStatus.toLowerCase() : currentOrder.orderStatus;
    const targetPayment = paymentStatus ? paymentStatus.toLowerCase() : currentOrder.paymentStatus;

    const isCancelled = targetStatus === "cancelled";

    // A cancelled order is never a confirmed purchase
    const isConfirmedPurchase =
      !isCancelled &&
      (["confirmed", "processing", "shipped", "delivered"].includes(targetStatus) ||
        targetPayment === "paid");

    await prisma.$transaction(async (tx) => {
      // 1. If becoming confirmed/paid and stock was NOT deducted, deduct now
      if (isConfirmedPurchase && !currentOrder.stockDeducted) {
        await deductOrderStock(id, tx);
      }

      // 2. If becoming cancelled and stock WAS deducted, restore now
      if (isCancelled && currentOrder.stockDeducted) {
        await restoreOrderStock(id, tx);
      }

      // 3. Record status history if status changed
      if (currentOrder.orderStatus !== targetStatus) {
        await tx.orderStatusHistory.create({
          data: {
            orderId: id,
            prevStatus: currentOrder.orderStatus,
            newStatus: targetStatus,
            comment: req.body.comment || `Status updated from ${currentOrder.orderStatus} to ${targetStatus}`,
            updatedBy: req.admin?.name || "Admin",
          },
        });
      }

      // 4. Update order statuses
      await tx.order.update({
        where: { id },
        data: {
          orderStatus: targetStatus,
          paymentStatus: targetPayment,
        },
      });
    });

    const updated = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        statusHistory: { orderBy: { createdAt: "desc" } },
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
        },
      },
    });

    return res.json({
      success: true,
      message: `Order status updated to '${targetStatus}'. Inventory synchronized automatically.`,
      data: formatOrder(updated),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/orders
 * Allows programmatic order creation with transactional stock deduction.
 */
async function createOrder(req, res, next) {
  try {
    const {
      customerId,
      customerEmail,
      customerName,
      customerPhone,
      shippingAddress,
      paymentMethod = "UPI",
      paymentStatus = "pending",
      orderStatus = "pending",
      items,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item.",
      });
    }

    // Resolve customer
    let resolvedCustomerId = customerId;
    if (!resolvedCustomerId && customerEmail) {
      const cust = await prisma.customer.upsert({
        where: { email: customerEmail.toLowerCase().trim() },
        update: {
          name: customerName || "Customer",
          phone: customerPhone || null,
        },
        create: {
          name: customerName || "Customer",
          email: customerEmail.toLowerCase().trim(),
          phone: customerPhone || null,
          address: shippingAddress || null,
        },
      });
      resolvedCustomerId = cust.id;
    }

    if (!resolvedCustomerId) {
      return res.status(400).json({
        success: false,
        message: "A valid customer is required for this order.",
      });
    }

    const orderNumber = `ORD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const orderItemsData = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: { images: { where: { isPrimary: true }, take: 1 } },
        });

        if (!product) {
          throw new Error(`Product with ID ${item.productId} was not found.`);
        }

        const qty = parseInt(item.quantity, 10) || 1;
        const price = Number(product.salePrice ?? product.regularPrice);
        const itemSubtotal = price * qty;
        subtotal += itemSubtotal;

        orderItemsData.push({
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          productImage: product.images?.[0]?.imageUrl || null,
          quantity: qty,
          unitPrice: price,
          subtotal: itemSubtotal,
        });
      }

      const totalAmount = subtotal;

      const order = await tx.order.create({
        data: {
          orderNumber,
          customerId: resolvedCustomerId,
          subtotal,
          deliveryCharge: 0,
          tax: 0,
          discount: 0,
          totalAmount,
          paymentMethod,
          paymentStatus,
          orderStatus,
          shippingAddress: shippingAddress || "",
          items: {
            create: orderItemsData,
          },
        },
      });

      // If created as confirmed/paid, deduct stock immediately
      if (
        ["confirmed", "processing", "shipped", "delivered"].includes(orderStatus.toLowerCase()) ||
        paymentStatus.toLowerCase() === "paid"
      ) {
        await deductOrderStock(order.id, tx);
      }

      return tx.order.findUnique({
        where: { id: order.id },
        include: {
          customer: true,
          items: {
            include: {
              product: {
                include: {
                  images: { where: { isPrimary: true }, take: 1 },
                },
              },
            },
          },
        },
      });
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully.",
      data: formatOrder(newOrder),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getOrders,
  getOrderById,
  updateOrderStatus,
  createOrder,
};
