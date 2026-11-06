import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getUnifiedAdminCategories,
  createUnifiedCategory,
} from '@/lib/store-products';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await getUnifiedAdminCategories();
    return NextResponse.json({
      success: true,
      message: 'Categories retrieved successfully',
      data: categories,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await createUnifiedCategory(body);

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/shop');
    } catch {
      // ignore revalidate errors
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Category created successfully',
        data: created,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create category' },
      { status: 500 }
    );
  }
}
