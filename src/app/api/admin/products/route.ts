import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getUnifiedAdminProducts,
  createUnifiedProduct,
} from '@/lib/store-products';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const query = (searchParams.get('query') || '').trim().toLowerCase();
    const category = searchParams.get('category') || 'all';
    const status = searchParams.get('status') || 'all';
    const stock = searchParams.get('stock') || 'all';
    const sort = searchParams.get('sort') || 'newest';

    let allProducts = await getUnifiedAdminProducts();

    if (query) {
      allProducts = allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    if (category && category !== 'all') {
      const catLower = category.toLowerCase();
      allProducts = allProducts.filter(
        (p) =>
          p.category.toLowerCase() === catLower ||
          p.categorySlug?.toLowerCase() === catLower ||
          p.categories?.some(
            (c) => c.name.toLowerCase() === catLower || c.slug.toLowerCase() === catLower
          )
      );
    }

    if (status && status !== 'all') {
      allProducts = allProducts.filter((p) => p.status === status.toLowerCase());
    }

    if (stock === 'in') {
      allProducts = allProducts.filter((p) => p.stock > 5);
    } else if (stock === 'low') {
      allProducts = allProducts.filter((p) => p.stock > 0 && p.stock <= 5);
    } else if (stock === 'out') {
      allProducts = allProducts.filter((p) => p.stock <= 0);
    }

    if (sort === 'price-asc') {
      allProducts.sort((a, b) => (a.salePrice || a.regularPrice) - (b.salePrice || b.regularPrice));
    } else if (sort === 'price-desc') {
      allProducts.sort((a, b) => (b.salePrice || b.regularPrice) - (a.salePrice || a.regularPrice));
    } else if (sort === 'name') {
      allProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      allProducts.sort((a, b) => b.id - a.id);
    }

    const total = allProducts.length;
    const skip = (page - 1) * limit;
    const paged = allProducts.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      message: 'Products retrieved successfully',
      data: paged,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await createUnifiedProduct(body);

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/shop');
      revalidatePath('/new-arrivals');
      revalidatePath('/combos');
    } catch {
      // ignore revalidate errors
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Product created successfully',
        data: created,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
