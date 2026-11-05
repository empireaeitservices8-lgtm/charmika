import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      billing,
      shipping,
      line_items,
      shipping_total,
      payment_method = 'payu',
      payment_method_title = 'PayU Secure Checkout',
      status = 'pending',
      customer_note = '',
      meta_data = []
    } = body;

    const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.WORDPRESS_URL || '';
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY || '';
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET || '';

    if (!baseUrl || !consumerKey || !consumerSecret) {
      return NextResponse.json(
        { success: false, error: 'WooCommerce API credentials are not configured in .env.local.' },
        { status: 500 }
      );
    }

    // Build the WooCommerce order payload
    const orderPayload = {
      payment_method,
      payment_method_title,
      set_paid: status === 'processing' || status === 'completed',
      status,
      billing: {
        first_name: billing?.firstName || '',
        last_name: billing?.lastName || '',
        address_1: billing?.addressLine1 || '',
        address_2: billing?.addressLine2 || '',
        city: billing?.city || '',
        state: billing?.state || '',
        postcode: billing?.pincode || '',
        country: 'IN',
        email: billing?.email || '',
        phone: billing?.phone || ''
      },
      shipping: {
        first_name: shipping?.firstName || billing?.firstName || '',
        last_name: shipping?.lastName || billing?.lastName || '',
        address_1: shipping?.addressLine1 || billing?.addressLine1 || '',
        address_2: shipping?.addressLine2 || billing?.addressLine2 || '',
        city: shipping?.city || billing?.city || '',
        state: shipping?.state || billing?.state || '',
        postcode: shipping?.pincode || billing?.pincode || '',
        country: 'IN'
      },
      line_items: (line_items || []).map((item: any) => {
        const itemMeta: { key: string; value: string }[] = [];
        if (item.isRental) {
          itemMeta.push({ key: 'Order Type', value: 'Rental' });
          if (item.rentalDurationDays) itemMeta.push({ key: 'Rental Days', value: String(item.rentalDurationDays) });
          if (item.rentalStartDate) itemMeta.push({ key: 'Rental Start Date', value: item.rentalStartDate });
          if (item.rentalEndDate) itemMeta.push({ key: 'Rental End Date', value: item.rentalEndDate });
        }
        return {
          product_id: Number(item.productId),
          quantity: Number(item.quantity) || 1,
          meta_data: itemMeta
        };
      }),
      customer_note: customer_note || undefined,
      shipping_lines: [
        {
          method_id: shipping_total && Number(shipping_total) > 0 ? 'flat_rate' : 'free_shipping',
          method_title: shipping_total && Number(shipping_total) > 0 ? 'Standard Shipping' : 'Free Shipping (Orders above ₹2,000)',
          total: String(shipping_total ?? (0))
        }
      ],
      meta_data: [
        { key: '_created_via', value: 'Charmika Next.js Web Store' },
        { key: '_shipping_carrier', value: 'Shiprocket' },
        ...(meta_data || [])
      ]
    };

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    const wooUrl = `${baseUrl.replace(/\/$/, '')}/wp-json/wc/v3/orders`;

    const res = await fetch(wooUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'User-Agent': 'CharmikaStorefront/1.0'
      },
      body: JSON.stringify(orderPayload),
      cache: 'no-store'
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('WooCommerce Order Create Error Response:', data);

      if (data.code === 'woocommerce_rest_authentication_error' || res.status === 401) {
        return NextResponse.json(
          {
            success: false,
            error: 'WooCommerce API Key lacks Write permission. Please change key permissions to "Read/Write" in WordPress Admin > WooCommerce > Settings > Advanced > REST API.',
            needsPermissionUpdate: true,
            details: data
          },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: data.message || 'Failed to create order in WooCommerce',
          details: data
        },
        { status: res.status }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: data.id,
      orderNumber: data.number || String(data.id),
      status: data.status,
      total: data.total,
      currency: data.currency
    });

  } catch (error: any) {
    console.error('Order creation exception:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error while creating order' },
      { status: 500 }
    );
  }
}
