import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.max(1, Math.min(20, parseInt(searchParams.get("limit") || "5", 10)));

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

    return NextResponse.json({
      success: true,
      message: "Out of stock products retrieved successfully.",
      data: formatted,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      message: "Fallback out of stock.",
      data: [],
    });
  }
}
