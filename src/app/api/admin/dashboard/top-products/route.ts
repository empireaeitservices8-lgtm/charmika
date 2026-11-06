import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.max(1, Math.min(10, parseInt(searchParams.get("limit") || "5", 10)));

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

    const prodMap: Record<number, any> = {};
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

    return NextResponse.json({
      success: true,
      message: "Top products retrieved successfully.",
      data: formatted,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      message: "Fallback top products.",
      data: [],
    });
  }
}
