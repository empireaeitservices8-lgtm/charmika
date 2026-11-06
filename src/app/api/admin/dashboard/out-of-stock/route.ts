import { NextRequest, NextResponse } from 'next/server';
import { getUnifiedAdminProducts } from '@/lib/store-products';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.max(1, Math.min(20, parseInt(searchParams.get('limit') || '5', 10)));
    const allProducts = await getUnifiedAdminProducts();
    const outOfStock = allProducts
      .filter((p) => p.stock <= 0)
      .slice(0, limit)
      .map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        category: p.category,
        price: Number(p.salePrice ?? p.regularPrice),
        stock: p.stock,
        imageUrl: p.primaryImage || p.images?.[0]?.url || null,
      }));

    return NextResponse.json({
      success: true,
      message: 'Out of stock products retrieved successfully.',
      data: outOfStock,
    });
  } catch {
    return NextResponse.json({
      success: true,
      message: 'Fallback out of stock.',
      data: [],
    });
  }
}
