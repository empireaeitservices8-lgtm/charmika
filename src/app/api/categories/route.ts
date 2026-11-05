import { NextResponse } from 'next/server';
import { WooCommerceService } from '@/services/woocommerce';

export const dynamic = 'force-dynamic';

export async function GET() {
  const categories = await WooCommerceService.getCategories();
  return NextResponse.json(categories);
}
