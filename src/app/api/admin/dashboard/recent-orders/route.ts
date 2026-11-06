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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.max(1, Math.min(20, parseInt(searchParams.get("limit") || "6", 10)));

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

    return NextResponse.json({
      success: true,
      message: "Recent orders retrieved successfully.",
      data: formatted,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      message: "Fallback orders.",
      data: [],
    });
  }
}
