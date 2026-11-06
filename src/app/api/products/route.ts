import { NextResponse } from 'next/server';
import { getStoreProducts } from '@/lib/store-products';

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
    const products = await getStoreProducts(parsedParams);
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
