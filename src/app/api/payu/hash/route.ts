import crypto from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { txnid, amount, productinfo, firstname, email } = await request.json();

    // Always use live credentials for correct hash generation.
    // The PAYU_ENV variable only controls which payment URL (test/live) is used on the frontend.
    const key = process.env.NEXT_PUBLIC_PAYU_KEY || '';
    const salt = process.env.PAYU_SALT || '';
    const isTest = process.env.PAYU_ENV !== 'live';

    if (!key || !salt) {
      return NextResponse.json({ success: false, error: 'PayU credentials not configured.' }, { status: 500 });
    }

    // Official PayU hash formula:
    // sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    return NextResponse.json({ success: true, hash, key, isTest });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to generate PayU hash' }, { status: 500 });
  }
}
