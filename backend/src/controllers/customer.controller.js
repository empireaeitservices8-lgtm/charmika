const prisma = require("../config/db");

function formatDate(date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatCustomer(c) {
  const totalOrders = c.orders ? c.orders.length : 0;
  const totalSpending = c.orders
    ? c.orders.reduce((sum, o) => sum + Number(o.totalAmount), 0)
    : 0;

  const mostRecentOrder =
    c.orders && c.orders.length > 0
      ? {
          id: c.orders[0].id,
          orderNumber: c.orders[0].orderNumber,
          date: formatDate(c.orders[0].createdAt),
          amount: Number(c.orders[0].totalAmount),
          status: c.orders[0].orderStatus,
        }
      : null;

  return {
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone || "—",
    status: c.status || "active",
    address: c.address || "",
    city: c.city || "",
    state: c.state || "",
    postalCode: c.postalCode || "",
    registrationDate: formatDate(c.createdAt),
    createdAt: c.createdAt,
    updatedAt: formatDate(c.updatedAt),
    totalOrders,
    totalSpending,
    mostRecentOrder,
    addresses: (c.addresses || []).map((a) => ({
      id: a.id,
      fullName: a.fullName || c.name,
      phone: a.phone || c.phone,
      addressLine1: a.addressLine1,
      addressLine2: a.addressLine2 || "",
      city: a.city,
      state: a.state,
      postalCode: a.postalCode,
      country: a.country || "India",
      isDefault: a.isDefault,
    })),
    orders: (c.orders || []).map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      date: formatDate(o.createdAt),
      totalAmount: Number(o.totalAmount),
      paymentStatus: o.paymentStatus,
      orderStatus: o.orderStatus,
      productNames: (o.items || []).map((i) => i.productName || i.product?.name).filter(Boolean).join(", "),
      itemsCount: o.items ? o.items.reduce((acc, i) => acc + i.quantity, 0) : 0,
    })),
  };
}

/**
 * GET /api/admin/customers
 */
async function getCustomers(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const { query } = req.query;

    const where = {};
    if (query && query.trim()) {
      const q = query.trim();
      where.OR = [
        { name: { contains: q } },
        { email: { contains: q } },
        { phone: { contains: q } },
      ];
    }

    const [total, customers] = await Promise.all([
      prisma.customer.count({ where }),
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          addresses: true,
          orders: {
            orderBy: { createdAt: "desc" },
            include: {
              items: {
                select: { productName: true, quantity: true },
              },
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return res.json({
      success: true,
      message: "Customers retrieved successfully.",
      data: customers.map(formatCustomer),
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
 * GET /api/admin/customers/:id
 */
async function getCustomerById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid customer ID." });
    }

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        addresses: true,
        orders: {
          orderBy: { createdAt: "desc" },
          include: {
            items: {
              select: { productName: true, quantity: true },
            },
          },
        },
      },
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found." });
    }

    return res.json({
      success: true,
      message: "Customer details retrieved successfully.",
      data: formatCustomer(customer),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/admin/customers/:id/status
 * Activate or deactivate customer account.
 */
async function updateCustomerStatus(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid customer ID." });
    }

    const { status } = req.body;
    if (!status || !["active", "inactive"].includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'active' or 'inactive'.",
      });
    }

    const updated = await prisma.customer.update({
      where: { id },
      data: { status: status.toLowerCase() },
      include: {
        addresses: true,
        orders: {
          orderBy: { createdAt: "desc" },
          include: {
            items: {
              select: { productName: true, quantity: true },
            },
          },
        },
      },
    });

    return res.json({
      success: true,
      message: `Customer account has been ${status.toLowerCase() === "active" ? "activated" : "deactivated"}.`,
      data: formatCustomer(updated),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/admin/customers/:id
 * Permanently deletes a customer and their records.
 */
async function deleteCustomer(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid customer ID." });
    }

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: { orders: { select: { id: true } } },
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found." });
    }

    await prisma.$transaction(async (tx) => {
      const orderIds = (customer.orders || []).map((o) => o.id);
      if (orderIds.length > 0) {
        // Delete order status history
        await tx.orderStatusHistory.deleteMany({
          where: { orderId: { in: orderIds } },
        });
        // Delete order items
        await tx.orderItem.deleteMany({
          where: { orderId: { in: orderIds } },
        });
        // Delete orders
        await tx.order.deleteMany({
          where: { id: { in: orderIds } },
        });
      }
      // Delete addresses
      await tx.customerAddress.deleteMany({
        where: { customerId: id },
      });
      // Delete customer
      await tx.customer.delete({
        where: { id },
      });
    });

    return res.json({
      success: true,
      message: `Customer '${customer.name}' has been deleted successfully.`,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCustomers,
  getCustomerById,
  updateCustomerStatus,
  deleteCustomer,
};

