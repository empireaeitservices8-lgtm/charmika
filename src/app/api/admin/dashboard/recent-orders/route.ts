import { NextRequest, NextResponse } from 'next/server';
import { getUnifiedOrders } from '@/lib/store-products';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.max(1, Math.min(20, parseInt(searchParams.get('limit') || '6', 10)));

    const orders = await getUnifiedOrders();
    const formatted = orders.slice(0, limit).map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      customerEmail: o.customerEmail,
      totalAmount: o.totalAmount,
      paymentStatus: o.paymentStatus,
      orderStatus: o.orderStatus,
      date: o.formattedDate,
      firstItem: o.items?.[0] || null,
    }));

    return NextResponse.json({
      success: true,
      message: 'Recent orders retrieved successfully.',
      data: formatted,
    });
  } catch {
    return NextResponse.json({
      success: true,
      message: 'Fallback orders.',
      data: [],
    });
  }
}
