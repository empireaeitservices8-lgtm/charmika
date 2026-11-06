import { NextRequest, NextResponse } from 'next/server';
import { getUnifiedOrders } from '@/lib/store-products';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '10', 10)));
    const skip = (page - 1) * limit;

    const query = (searchParams.get('query') || '').trim().toLowerCase();
    const orderStatus = searchParams.get('orderStatus') || 'all';
    const paymentStatus = searchParams.get('paymentStatus') || 'all';

    let orders = await getUnifiedOrders();

    if (query) {
      orders = orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(query) ||
          o.customerName.toLowerCase().includes(query) ||
          o.customerEmail.toLowerCase().includes(query)
      );
    }

    if (orderStatus && orderStatus !== 'all') {
      orders = orders.filter((o) => o.orderStatus.toLowerCase() === orderStatus.toLowerCase());
    }

    if (paymentStatus && paymentStatus !== 'all') {
      orders = orders.filter((o) => o.paymentStatus.toLowerCase() === paymentStatus.toLowerCase());
    }

    const total = orders.length;
    const paged = orders.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      message: 'Orders retrieved successfully.',
      data: paged,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch {
    return NextResponse.json({
      success: true,
      message: 'Orders retrieved.',
      data: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
    });
  }
}
