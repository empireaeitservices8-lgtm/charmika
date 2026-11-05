import { NextResponse } from 'next/server';
import { WooCommerceService } from '@/services/woocommerce';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await WooCommerceService.updateProduct(id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Failed to update product.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await WooCommerceService.deleteProduct(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete product.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

