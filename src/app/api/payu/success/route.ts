import { NextResponse } from 'next/server';
import { updateUnifiedOrderStatus } from '@/lib/store-products';

export async function POST(request: Request) {
  const baseUrl =
    request.headers.get('origin') ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://www.charmikabylekshmi.com';

  try {
    const formData = await request.formData();
    const status = formData.get('status')?.toString();
    const txnid = formData.get('txnid')?.toString() || '';
    const payuMoneyId = formData.get('payuMoneyId')?.toString() || '';

    let orderId: string | null = null;
    const match = txnid.match(/CBL-ORD-(\d+)-/);
    if (match && match[1]) {
      orderId = match[1];
    }

    if (status === 'success') {
      if (orderId) {
        await updateUnifiedOrderStatus(Number(orderId), {
          orderStatus: 'confirmed',
          paymentStatus: 'paid',
          transactionId: payuMoneyId || txnid,
          comment: 'Payment verified via PayU Secure Checkout',
        });
      }

      const redirectUrl = new URL(`${baseUrl}/order-success`);
      if (orderId) redirectUrl.searchParams.set('order_id', orderId);
      redirectUrl.searchParams.set('payment_id', txnid);
      redirectUrl.searchParams.set('payment_method', 'payu');

      return NextResponse.redirect(redirectUrl.toString(), 303);
    } else {
      if (orderId) {
        await updateUnifiedOrderStatus(Number(orderId), {
          paymentStatus: 'failed',
          comment: 'PayU payment attempt failed or cancelled',
        });
      }
      return NextResponse.redirect(`${baseUrl}/checkout?error=Payment+Failed`, 303);
    }
  } catch (error) {
    console.error('PayU Success Callback Exception:', error);
    return NextResponse.redirect(`${baseUrl}/checkout?error=Server+Error`, 303);
  }
}
