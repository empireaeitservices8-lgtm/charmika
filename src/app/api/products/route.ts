import { NextResponse } from 'next/server';
import { WooCommerceService } from '@/services/woocommerce';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());
  const parsedParams = {
    ...params,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    rentalOnly: params.rentalOnly === 'true',
    combosOnly: params.combosOnly === 'true',
    newArrivalsOnly: params.newArrivalsOnly === 'true'
  };
  const products = await WooCommerceService.getProducts(parsedParams);
  return NextResponse.json(products);
}
