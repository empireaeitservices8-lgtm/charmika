import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatDate(date: any) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatCustomer(c: any) {
  const totalOrders = c.orders ? c.orders.length : 0;
  const totalSpending = c.orders
    ? c.orders.reduce((sum: number, o: any) => sum + Number(o.totalAmount), 0)
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
    addresses: (c.addresses || []).map((a: any) => ({
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
    orders: (c.orders || []).map((o: any) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      date: formatDate(o.createdAt),
      totalAmount: Number(o.totalAmount),
      paymentStatus: o.paymentStatus,
      orderStatus: o.orderStatus,
      productNames: (o.items || []).map((i: any) => i.productName || i.product?.name).filter(Boolean).join(", "),
      itemsCount: o.items ? o.items.reduce((acc: number, i: any) => acc + i.quantity, 0) : 0,
    })),
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10", 10)));
    const skip = (page - 1) * limit;

    const query = searchParams.get("query");

    const where: any = {};
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

    return NextResponse.json({
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
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to retrieve customers." },
      { status: 500 }
    );
  }
}
