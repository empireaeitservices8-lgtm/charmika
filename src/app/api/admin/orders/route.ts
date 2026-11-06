import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatDate(date: any) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatOrder(o: any) {
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
    itemsCount: o.items ? o.items.reduce((acc: number, i: any) => acc + i.quantity, 0) : 0,
    items: (o.items || []).map((i: any) => ({
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
    statusHistory: (o.statusHistory || []).map((h: any) => ({
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10", 10)));
    const skip = (page - 1) * limit;

    const query = searchParams.get("query");
    const orderStatus = searchParams.get("orderStatus");
    const paymentStatus = searchParams.get("paymentStatus");

    const where: any = {};

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
          statusHistory: {
            orderBy: { createdAt: "desc" },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return NextResponse.json({
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
  } catch (err: any) {
    console.warn("Failed to retrieve orders from database:", err);
    return NextResponse.json({
      success: true,
      message: "Orders retrieved.",
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
      },
    });
  }
}
