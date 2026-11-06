import { NextRequest, NextResponse } from 'next/server';
import { getUnifiedOrders } from '@/lib/store-products';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId, 10);
    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: 'Invalid order ID.' }, { status: 400 });
    }

    const orders = await getUnifiedOrders();
    const order = orders.find((o) => o.id === id);

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Order retrieved successfully.',
      data: order,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to retrieve order.' },
      { status: 500 }
    );
  }
}
