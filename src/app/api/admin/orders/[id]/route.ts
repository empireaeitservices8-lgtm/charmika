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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId, 10);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "Invalid order ID." }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
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
    });

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Order retrieved successfully.",
      data: formatOrder(order),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to retrieve order." },
      { status: 500 }
    );
  }
}
