import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = 'INR', receipt, notes } = await req.json();

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid order amount' },
        { status: 400 }
      );
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    const isPlaceholderKey =
      !keyId ||
      !keySecret ||
      keyId.includes('YOUR_KEY_ID') ||
      keySecret.includes('YOUR_RAZORPAY_SECRET_KEY');

    if (isPlaceholderKey) {
      // Return a structured demo response if keys are not yet configured in .env.local
      console.warn(
        '[Razorpay API] Using Demo Mode because valid Razorpay credentials were not found in .env.local.'
      );
      return NextResponse.json({
        success: true,
        isDemo: true,
        orderId: `order_demo_${Date.now()}`,
        amount: Math.round(amount * 100),
        currency,
        keyId: keyId || 'rzp_test_demo',
        message: 'Razorpay keys not configured yet in .env.local. Demo order created.',
      });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: Math.round(amount * 100), // amount in paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || { source: 'Charmika Web App' },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      isDemo: false,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (error: any) {
    console.error('[Razorpay Create Order Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to create Razorpay order',
      },
      { status: 500 }
    );
  }
}
