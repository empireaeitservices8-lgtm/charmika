import { NextRequest, NextResponse } from 'next/server';
import { updateUnifiedOrderStatus } from '@/lib/store-products';

export const dynamic = 'force-dynamic';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId, 10);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: 'Invalid order ID.' }, { status: 400 });
    }

    const { orderStatus, paymentStatus, comment } = await req.json();
    const updated = await updateUnifiedOrderStatus(id, {
      orderStatus,
      paymentStatus,
      comment,
    });

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Order not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully.',
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to update order status.' },
      { status: 500 }
    );
  }
}
