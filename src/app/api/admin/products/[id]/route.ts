import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getUnifiedAdminProducts,
  updateUnifiedProduct,
  deleteUnifiedProduct,
} from '@/lib/store-products';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numId = Number(id);
    const allProducts = await getUnifiedAdminProducts();
    const found = allProducts.find((p) => p.id === numId);

    if (!found) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product retrieved successfully',
      data: found,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateUnifiedProduct(Number(id), body);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/shop');
      revalidatePath(`/product/${updated.slug}`);
      revalidatePath('/new-arrivals');
      revalidatePath('/combos');
    } catch {
      // ignore revalidate errors
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteUnifiedProduct(Number(id));

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/shop');
      revalidatePath('/new-arrivals');
      revalidatePath('/combos');
    } catch {
      // ignore revalidate errors
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      data: null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}
