const prisma = require("../config/db");

function formatDate(date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

/**
 * GET /api/admin/dashboard/stats
 * Aggregates core revenue and volume metrics.
 */
async function getStats(req, res, next) {
  try {
    const [
      totalProducts,
      activePublic,
      inactive,
      outOfStock,
      totalCategories,
      totalOrders,
      totalCustomers,
      revenueResult,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { status: "ACTIVE" } }),
      prisma.product.count({ where: { status: "INACTIVE" } }),
      prisma.product.count({ where: { stock: { lte: 0 } } }),
      prisma.category.count({ where: { status: "ACTIVE" } }),
      prisma.order.count(),
      prisma.customer.count(),
      prisma.order.aggregate({
        where: {
          paymentStatus: "paid",
        },
        _sum: {
          totalAmount: true,
        },
      }),
    ]);

    const totalRevenue = Number(revenueResult._sum?.totalAmount || 0);

    return res.json({
      success: true,
      message: "Dashboard statistics retrieved successfully.",
      data: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        activePublic,
        inactive,
        outOfStock,
        totalCategories,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/dashboard/recent-orders
 * Returns 6 most recent orders for the dashboard overview.
 */
async function getRecentOrders(req, res, next) {
  try {
    const limit = Math.max(1, Math.min(20, parseInt(req.query.limit, 10) || 6));

    const orders = await prisma.order.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        items: {
          take: 1,
          select: { productName: true, productImage: true },
        },
      },
    });

    const formatted = orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customer?.name || "Customer",
      customerEmail: o.customer?.email || "",
      totalAmount: Number(o.totalAmount),
      paymentStatus: o.paymentStatus,
      orderStatus: o.orderStatus,
      date: formatDate(o.createdAt),
      firstItem: o.items?.[0] || null,
    }));

    return res.json({
      success: true,
      message: "Recent orders retrieved successfully.",
      data: formatted,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/dashboard/recent-customers
 * Returns 6 most recent registered customers for the dashboard overview.
 */
async function getRecentCustomers(req, res, next) {
  try {
    const limit = Math.max(1, Math.min(20, parseInt(req.query.limit, 10) || 6));

    const customers = await prisma.customer.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        orders: {
          select: { totalAmount: true },
        },
      },
    });

    const formatted = customers.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone || "—",
      status: c.status,
      date: formatDate(c.createdAt),
      totalOrders: c.orders.length,
      totalSpent: c.orders.reduce((sum, o) => sum + Number(o.totalAmount), 0),
    }));

    return res.json({
      success: true,
      message: "Recent customers retrieved successfully.",
      data: formatted,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/dashboard/top-products
 * Returns top-selling products based on order volumes.
 */
async function getTopProducts(req, res, next) {
  try {
    const limit = Math.max(1, Math.min(10, parseInt(req.query.limit, 10) || 5));

    const orderItems = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: {
        quantity: true,
        subtotal: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: limit,
    });

    const productIds = orderItems.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        category: true,
        images: { where: { isPrimary: true }, take: 1 },
      },
    });

    const prodMap = {};
    products.forEach((p) => {
      prodMap[p.id] = p;
    });

    const formatted = orderItems
      .map((item) => {
        const prod = prodMap[item.productId];
        if (!prod) return null;
        return {
          id: prod.id,
          name: prod.name,
          sku: prod.sku,
          category: prod.category?.name || "Jewellery",
          price: Number(prod.salePrice ?? prod.regularPrice),
          stock: prod.stock,
          totalSold: item._sum.quantity || 0,
          totalRevenue: Number(item._sum.subtotal || 0),
          imageUrl: prod.images?.[0]?.imageUrl || null,
        };
      })
      .filter(Boolean);

    return res.json({
      success: true,
      message: "Top products retrieved successfully.",
      data: formatted,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/dashboard/out-of-stock
 * Returns items that are out of stock (stock <= 0).
 */
async function getOutOfStockProducts(req, res, next) {
  try {
    const limit = Math.max(1, Math.min(20, parseInt(req.query.limit, 10) || 5));

    const products = await prisma.product.findMany({
      where: { stock: { lte: 0 } },
      take: limit,
      orderBy: { updatedAt: "desc" },
      include: {
        category: true,
        images: { where: { isPrimary: true }, take: 1 },
      },
    });

    const formatted = products.map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      category: p.category?.name || "Jewellery",
      price: Number(p.regularPrice),
      stock: p.stock,
      imageUrl: p.images?.[0]?.imageUrl || null,
    }));

    return res.json({
      success: true,
      message: "Out of stock products retrieved successfully.",
      data: formatted,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/dashboard/recent-products
 * Returns recent products for backwards compatibility.
 */
async function getRecentProducts(req, res, next) {
  try {
    const limit = Math.max(1, Math.min(20, parseInt(req.query.limit, 10) || 5));

    const products = await prisma.product.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        images: { where: { isPrimary: true }, take: 1 },
      },
    });

    const formatted = products.map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      category: p.category?.name || "Uncategorized",
      regular: Number(p.regularPrice),
      sale: p.salePrice ? Number(p.salePrice) : null,
      stock: p.stock,
      status: p.status.toLowerCase(),
      added: formatDate(p.createdAt),
      imageUrl: p.images?.[0]?.imageUrl || null,
    }));

    return res.json({
      success: true,
      message: "Recent products retrieved successfully.",
      data: formatted,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getStats,
  getRecentOrders,
  getRecentCustomers,
  getTopProducts,
  getOutOfStockProducts,
  getRecentProducts,
};
