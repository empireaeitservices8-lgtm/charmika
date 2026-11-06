import { NextResponse } from 'next/server';
import { createUnifiedOrder } from '@/lib/store-products';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await createUnifiedOrder(body);

    return NextResponse.json({
      success: true,
      orderId: created.id,
      orderNumber: created.orderNumber,
      status: created.orderStatus,
      total: String(created.totalAmount),
      currency: 'INR',
    });
  } catch (error: any) {
    console.error('Order creation exception:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error while creating order' },
      { status: 500 }
    );
  }
}
