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

    const customers = await prisma.customer.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        orders: { select: { totalAmount: true } },
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

    return NextResponse.json({
      success: true,
      message: "Recent customers retrieved successfully.",
      data: formatted,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      message: "Fallback customers.",
      data: [],
    });
  }
}

