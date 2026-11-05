import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const baseUrl = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  try {
    const formData = await request.formData();
    const status = formData.get('status')?.toString();
    const txnid = formData.get('txnid')?.toString() || '';
    const payuMoneyId = formData.get('payuMoneyId')?.toString() || '';

    // Extract order ID if embedded in txnid: "CBL-ORD-{orderId}-{timestamp}"
    let orderId: string | null = null;
    const match = txnid.match(/CBL-ORD-(\d+)-/);
    if (match && match[1]) {
      orderId = match[1];
    }

    if (status === 'success') {
      // Update WooCommerce order status to 'processing' (triggers Shiprocket sync)
      if (orderId) {
        try {
          const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.WORDPRESS_URL || '';
          const ck = process.env.WOOCOMMERCE_CONSUMER_KEY || '';
          const cs = process.env.WOOCOMMERCE_CONSUMER_SECRET || '';

          if (wpUrl && ck && cs) {
            const auth = Buffer.from(`${ck}:${cs}`).toString('base64');
            await fetch(`${wpUrl.replace(/\/$/, '')}/wp-json/wc/v3/orders/${orderId}`, {
              method: 'PUT',
              headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                status: 'processing',
                set_paid: true,
                transaction_id: payuMoneyId || txnid
              }),
              cache: 'no-store'
            });
          }
        } catch (wcErr) {
          console.error('Failed to update WooCommerce order after PayU payment:', wcErr);
        }
      }

      // Redirect to Order Success page
      const redirectUrl = new URL(`${baseUrl}/order-success`);
      if (orderId) redirectUrl.searchParams.set('order_id', orderId);
      redirectUrl.searchParams.set('payment_id', txnid);
      redirectUrl.searchParams.set('payment_method', 'payu');

      return NextResponse.redirect(redirectUrl.toString(), 303);
    } else {
      return NextResponse.redirect(`${baseUrl}/checkout?error=Payment+Failed`, 303);
    }
  } catch (error) {
    console.error('PayU Success Callback Exception:', error);
    return NextResponse.redirect(`${baseUrl}/checkout?error=Server+Error`, 303);
  }
}
