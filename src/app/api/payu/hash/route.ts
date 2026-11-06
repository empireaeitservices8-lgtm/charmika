import crypto from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const txnid = String(body.txnid || '').trim();
    const amount = Number(body.amount || 0).toFixed(2);
    const productinfo = String(body.productinfo || 'Charmika Jewellery').trim();
    const firstname = String(body.firstname || 'Customer').trim();
    const email = String(body.email || '').trim();

    const key = (process.env.NEXT_PUBLIC_PAYU_KEY || 'F6f1BF').trim();
    const salt = (process.env.PAYU_SALT || 'qoK3DHXVDYBPkmCHLYEYEBT6TfdQTBeq').trim();
    const payuEnv = (process.env.PAYU_ENV || 'live').trim().toLowerCase();
    const isTest = payuEnv === 'test';

    if (!key || !salt) {
      return NextResponse.json(
        { success: false, error: 'PayU credentials not configured.' },
        { status: 500 }
      );
    }

    // Official PayU hash formula:
    // sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    return NextResponse.json({
      success: true,
      hash,
      key,
      isTest,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to generate PayU hash' },
      { status: 500 }
    );
  }
}
