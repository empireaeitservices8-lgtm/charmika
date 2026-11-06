import { NextResponse } from 'next/server';
import { updateUnifiedOrderStatus, getUnifiedOrderById } from '@/lib/store-products';
import { createShiprocketOrder } from '@/lib/shiprocket';

export async function POST(request: Request) {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    new URL(request.url).origin ||
    'https://www.charmikabylekshmi.com'
  ).replace(/\/$/, '');

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

        // Automatically push paid order to Shiprocket
        try {
          const order = await getUnifiedOrderById(Number(orderId));
          if (order) {
            const srRes = await createShiprocketOrder({
              orderId: order.id,
              orderDate: new Date(order.createdAt).toISOString().slice(0, 19).replace('T', ' '),
              customerName: order.shippingDetails?.firstName || order.customerName,
              customerLastName: order.shippingDetails?.lastName || '',
              customerEmail: order.customerEmail,
              customerPhone: order.customerPhone,
              addressLine1: order.shippingDetails?.addressLine1 || order.shippingAddress,
              addressLine2: order.shippingDetails?.addressLine2 || '',
              city: order.shippingDetails?.city || 'Kottayam',
              state: order.shippingDetails?.state || 'Kerala',
              pincode: order.shippingDetails?.pincode || '686008',
              items: (order.items || []).map((it) => ({
                name: it.productName,
                sku: it.sku || `SKU-${it.productId}`,
                units: it.quantity,
                selling_price: it.unitPrice,
              })),
              subTotal: order.totalAmount,
              paymentMethod: 'Prepaid',
            });

            if (srRes.success) {
              await updateUnifiedOrderStatus(Number(orderId), {
                shiprocketOrderId: srRes.shiprocketOrderId,
                shipmentId: srRes.shipmentId,
                awbCode: srRes.awbCode,
                courierName: srRes.courierName,
                comment: `Shiprocket order #${srRes.shiprocketOrderId} created (Pickup: KARTHIKA)`,
              });
            }
          }
        } catch (srErr) {
          console.error('Shiprocket auto-creation error:', srErr);
        }
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
