import { NextResponse } from 'next/server';
import { getUnifiedOrders } from '@/lib/store-products';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('orderId') || searchParams.get('q') || '').trim();

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Please provide an Order ID or Tracking Number.' },
        { status: 400 }
      );
    }

    const cleanId = query.replace(/[^0-9]/g, '');
    const allOrders = await getUnifiedOrders();
    const matched = allOrders.find(
      (o) =>
        String(o.id) === cleanId ||
        o.orderNumber.toLowerCase() === query.toLowerCase() ||
        o.orderNumber.toLowerCase().includes(query.toLowerCase())
    );

    if (!matched) {
      return NextResponse.json(
        { success: false, error: `Order #${query} not found. Please check your Order ID.` },
        { status: 404 }
      );
    }

    let currentStage = 1;
    let statusLabel = 'Order Confirmed';
    let statusDescription = 'Your order has been received and verified.';

    switch (matched.orderStatus.toLowerCase()) {
      case 'pending':
        currentStage = 1;
        statusLabel = 'Order Received';
        statusDescription = 'Your order has been logged and is being verified.';
        break;
      case 'confirmed':
      case 'processing':
      case 'packed':
        currentStage = 2;
        statusLabel = 'Preparing for Shipment';
        statusDescription = 'Items are being inspected and safely packed in luxury jewellery boxes.';
        break;
      case 'shipped':
        currentStage = 3;
        statusLabel = 'In Transit';
        statusDescription = 'Package is in transit with Shiprocket Express.';
        break;
      case 'delivered':
      case 'completed':
        currentStage = 5;
        statusLabel = 'Delivered';
        statusDescription = 'Shipment has been safely delivered to customer.';
        break;
      case 'cancelled':
        currentStage = 0;
        statusLabel = 'Cancelled';
        statusDescription = 'This order was cancelled.';
        break;
      default:
        currentStage = 2;
        statusLabel = matched.orderStatus;
        statusDescription = 'Order is in progress.';
    }

    return NextResponse.json({
      success: true,
      order: {
        id: matched.id,
        number: matched.orderNumber,
        date: matched.createdAt,
        status: matched.orderStatus,
        statusLabel,
        statusDescription,
        currentStage,
        total: String(matched.totalAmount),
        currency: '₹',
        customerName: matched.customerName,
        destination: matched.shippingAddress,
        items: matched.items.map((item) => ({
          id: item.id,
          name: item.productName,
          quantity: item.quantity,
          total: String(item.subtotal),
        })),
        shipping: {
          carrier: matched.courierName || 'Shiprocket Express',
          awb: matched.awbCode || null,
          shiprocketOrderId: matched.shiprocketOrderId || null,
          trackingUrl: matched.awbCode
            ? `https://shiprocket.co/tracking/${matched.awbCode}`
            : null,
        },
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error while tracking order' },
      { status: 500 }
    );
  }
}
