// =======================================================
// Charmika By Lekshmi - Official Shiprocket Integration
// =======================================================

interface ShiprocketOrderItem {
  name: string;
  sku: string;
  units: number;
  selling_price: number;
  discount?: number;
  tax?: number;
}

interface CreateShiprocketOrderParams {
  orderId: number | string;
  orderDate?: string;
  customerName: string;
  customerLastName?: string;
  customerEmail: string;
  customerPhone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  items: ShiprocketOrderItem[];
  subTotal: number;
  paymentMethod?: 'Prepaid' | 'COD';
}

let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

/**
 * Authenticate with Shiprocket API and retrieve JWT token
 */
export async function getShiprocketToken(): Promise<string | null> {
  // Check cached token (valid with 1 hour buffer)
  if (cachedToken && Date.now() < tokenExpiresAt - 3600000) {
    return cachedToken;
  }

  const email = (process.env.SHIPROCKET_EMAIL || 'sampleks123@gmail.com').trim();
  const password = (process.env.SHIPROCKET_PASSWORD || 'PW1nI7JeyN3f@Va0YTYTGLA$yqgUkwHX').trim();

  if (!email || !password) {
    console.warn('Shiprocket credentials not configured.');
    return null;
  }

  try {
    const res = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Shiprocket login failed:', res.status, err);
      return null;
    }

    const data = await res.json();
    if (data.token) {
      cachedToken = data.token;
      // Tokens are typically valid for 10 days (864000s)
      tokenExpiresAt = Date.now() + 864000000;
      return cachedToken;
    }
  } catch (err) {
    console.error('Shiprocket authentication exception:', err);
  }

  return null;
}

/**
 * Create a new order in Shiprocket
 */
export async function createShiprocketOrder(params: CreateShiprocketOrderParams) {
  try {
    const token = await getShiprocketToken();
    if (!token) {
      return { success: false, error: 'Shiprocket authentication unavailable' };
    }

    const orderIdStr = String(params.orderId);
    const cleanPhone = String(params.customerPhone || '9400976257').replace(/\D/g, '').slice(-10);
    const nowIso = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const payload = {
      order_id: `CBL-ORD-${orderIdStr}`,
      order_date: params.orderDate || nowIso,
      pickup_location: 'KARTHIKA',
      billing_customer_name: params.customerName || 'Customer',
      billing_last_name: params.customerLastName || '',
      billing_address: params.addressLine1 || 'Building No. 4, Karthika',
      billing_address_2: params.addressLine2 || '',
      billing_city: params.city || 'Kottayam',
      billing_pincode: params.pincode || '686008',
      billing_state: params.state || 'Kerala',
      billing_country: 'India',
      billing_email: params.customerEmail || 'charmikajewel@gmail.com',
      billing_phone: cleanPhone.length === 10 ? cleanPhone : '9400976257',
      shipping_is_billing: true,
      order_items: (params.items && params.items.length > 0)
        ? params.items.map((it, idx) => ({
            name: it.name || `Jewellery Item ${idx + 1}`,
            sku: it.sku || `SKU-${idx + 1}`,
            units: Number(it.units) || 1,
            selling_price: Number(it.selling_price) || 0,
            discount: 0,
            tax: 0,
          }))
        : [
            {
              name: `Charmika Jewellery Order #${orderIdStr}`,
              sku: `CBL-JEWEL-${orderIdStr}`,
              units: 1,
              selling_price: Number(params.subTotal) || 0,
              discount: 0,
              tax: 0,
            },
          ],
      payment_method: params.paymentMethod || 'Prepaid',
      sub_total: Number(params.subTotal) || 0,
      length: 10,
      breadth: 10,
      height: 5,
      weight: 0.5,
    };

    const res = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const data = await res.json();
    console.log('Shiprocket order creation response:', data);

    if (res.ok && data.order_id) {
      return {
        success: true,
        shiprocketOrderId: data.order_id,
        shipmentId: data.shipment_id,
        status: data.status,
        statusCode: data.status_code,
        awbCode: data.awb_code || null,
        courierName: data.courier_name || null,
      };
    } else {
      return {
        success: false,
        error: data.message || 'Failed to create order on Shiprocket',
        raw: data,
      };
    }
  } catch (err: any) {
    console.error('Shiprocket order creation error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Get live tracking details by AWB code or Shipment ID from Shiprocket
 */
export async function getShiprocketTracking(awbCode: string) {
  try {
    const token = await getShiprocketToken();
    if (!token) return null;

    const res = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awbCode}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch Shiprocket tracking:', err);
  }
  return null;
}
