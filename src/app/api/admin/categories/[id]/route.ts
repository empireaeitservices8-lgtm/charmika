import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getUnifiedAdminCategories,
  updateUnifiedCategory,
  deleteUnifiedCategory,
} from '@/lib/store-products';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categories = await getUnifiedAdminCategories();
    const cat = categories.find((c) => c.id === Number(id));
    if (!cat) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'Category retrieved',
      data: cat,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to fetch category' },
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
    const updated = await updateUnifiedCategory(Number(id), body);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/shop');
    } catch {
      // ignore revalidate errors
    }

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update category' },
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
    await deleteUnifiedCategory(Number(id));

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/shop');
    } catch {
      // ignore revalidate errors
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
      data: null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete category' },
      { status: 500 }
    );
  }
}
