import { NextResponse } from 'next/server';
import { WooCommerceService } from '@/services/woocommerce';
import { products as mockProducts } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    const parsedParams = {
      ...params,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      rentalOnly: params.rentalOnly === 'true',
      combosOnly: params.combosOnly === 'true',
      newArrivalsOnly: params.newArrivalsOnly === 'true',
    };
    const products = await WooCommerceService.getProducts(parsedParams);

    if (products && products.length > 0) {
      return NextResponse.json(products);
    }
    return NextResponse.json(mockProducts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await WooCommerceService.createProduct(body);

    if (!created) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Failed to create product in WooCommerce. Please ensure your WooCommerce Consumer Key and Consumer Secret are configured in environment variables.',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, product: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
