import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('orderId') || searchParams.get('q') || '').trim();
    const phone = (searchParams.get('phone') || '').trim();

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Please provide an Order ID or Tracking Number.' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.WORDPRESS_URL || '';
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || '';
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || '';

    if (!baseUrl || !consumerKey || !consumerSecret) {
      return NextResponse.json(
        { success: false, error: 'WooCommerce API is not configured.' },
        { status: 500 }
      );
    }

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    const cleanOrderId = query.replace(/[^0-9]/g, '');

    let orderData: any = null;

    // 1. Try fetching directly by numeric Order ID
    if (cleanOrderId) {
      try {
        const orderUrl = `${baseUrl.replace(/\/$/, '')}/wp-json/wc/v3/orders/${cleanOrderId}`;
        const res = await fetch(orderUrl, {
          headers: {
            'Authorization': `Basic ${auth}`,
            'User-Agent': 'CharmikaStorefront/1.0'
          },
          cache: 'no-store'
        });
        if (res.ok) {
          orderData = await res.json();
        }
      } catch (err) {
        console.error('Direct order fetch error:', err);
      }
    }

    // 2. If not found by direct ID, search orders via search query (can be AWB, phone, customer name)
    if (!orderData) {
      try {
        const searchUrl = `${baseUrl.replace(/\/$/, '')}/wp-json/wc/v3/orders?search=${encodeURIComponent(query)}&per_page=5`;
        const res = await fetch(searchUrl, {
          headers: {
            'Authorization': `Basic ${auth}`,
            'User-Agent': 'CharmikaStorefront/1.0'
          },
          cache: 'no-store'
        });
        if (res.ok) {
          const orders = await res.json();
          if (Array.isArray(orders) && orders.length > 0) {
            orderData = orders[0];
          }
        }
      } catch (err) {
        console.error('Search order error:', err);
      }
    }

    if (!orderData || !orderData.id) {
      return NextResponse.json(
        { success: false, error: `Order #${query} not found. Please check your Order ID.` },
        { status: 404 }
      );
    }

    // Optional phone validation for security if provided
    if (phone) {
      const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
      const billingPhone = (orderData.billing?.phone || '').replace(/[^0-9]/g, '').slice(-10);
      if (cleanPhone && billingPhone && !billingPhone.includes(cleanPhone) && !cleanPhone.includes(billingPhone)) {
        return NextResponse.json(
          { success: false, error: 'Phone number does not match the order records.' },
          { status: 403 }
        );
      }
    }

    // Extract Shiprocket metadata
    const metaList: Array<{ key: string; value: any }> = orderData.meta_data || [];
    const findMeta = (keys: string[]) => {
      const match = metaList.find(m => keys.some(k => m.key.toLowerCase() === k.toLowerCase()));
      return match ? match.value : null;
    };

    const awb = findMeta([
      '_shiprocket_awb',
      'shiprocket_awb',
      'awb_code',
      '_awb_code',
      'tracking_number',
      '_tracking_number'
    ]);

    const courier = findMeta([
      '_shiprocket_courier',
      'shiprocket_courier',
      'courier_name',
      '_courier_name',
      'shipping_provider'
    ]) || 'Shiprocket Express';

    const shiprocketOrderId = findMeta([
      '_shiprocket_order_id',
      'shiprocket_order_id',
      'shipment_id',
      '_shiprocket_shipment_id'
    ]);

    // Build tracking URL (Shiprocket public tracking portal)
    const trackingUrl = awb
      ? `https://shiprocket.co/tracking/${awb}`
      : (shiprocketOrderId ? `https://shiprocket.co/tracking/${shiprocketOrderId}` : null);

    // Map WooCommerce status to readable tracking stages
    // Stages: 1=Confirmed, 2=Processing/Packed, 3=Shipped/In Transit, 4=Out for Delivery, 5=Delivered
    let currentStage = 1;
    let statusLabel = 'Order Confirmed';
    let statusDescription = 'Your order has been received and verified.';

    switch (orderData.status) {
      case 'pending':
        currentStage = 1;
        statusLabel = 'Payment Pending';
        statusDescription = 'Awaiting payment confirmation.';
        break;
      case 'on-hold':
        currentStage = 1;
        statusLabel = 'Order On Hold';
        statusDescription = 'Order is under manual verification.';
        break;
      case 'processing':
        currentStage = awb ? 3 : 2;
        statusLabel = awb ? 'Dispatched via Shiprocket' : 'Preparing for Shipment';
        statusDescription = awb
          ? `Dispatched with ${courier}. AWB: ${awb}`
          : 'Items are being inspected and safely packed in luxury jewellery boxes.';
        break;
      case 'shipped':
        currentStage = 3;
        statusLabel = 'In Transit';
        statusDescription = `Package is in transit with ${courier}.`;
        break;
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
      case 'refunded':
        currentStage = 0;
        statusLabel = 'Refunded';
        statusDescription = 'This order has been refunded.';
        break;
      default:
        currentStage = 2;
        statusLabel = orderData.status;
        statusDescription = 'Order is in progress.';
    }

    return NextResponse.json({
      success: true,
      order: {
        id: orderData.id,
        number: orderData.number || String(orderData.id),
        date: orderData.date_created,
        status: orderData.status,
        statusLabel,
        statusDescription,
        currentStage,
        total: orderData.total,
        currency: orderData.currency_symbol || '₹',
        customerName: `${orderData.billing?.first_name || ''} ${orderData.billing?.last_name || ''}`.trim(),
        destination: `${orderData.shipping?.city || orderData.billing?.city || ''}, ${orderData.shipping?.state || orderData.billing?.state || ''} ${orderData.shipping?.postcode || orderData.billing?.postcode || ''}`.trim(),
        items: (orderData.line_items || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          total: item.total
        })),
        shipping: {
          carrier: courier,
          awb: awb || null,
          shiprocketOrderId: shiprocketOrderId || null,
          trackingUrl: trackingUrl || null
        }
      }
    });

  } catch (error: any) {
    console.error('Tracking API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while tracking order' },
      { status: 500 }
    );
  }
}
