import { NextResponse } from 'next/server';
import { WooCommerceService } from '@/services/woocommerce';

export async function GET(request: Request) {
  // We need to fetch from WordPress directly (wp/v2/media/59)
  const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.WORDPRESS_URL || '';
  const url = `${baseUrl.replace(/\/$/, '')}/wp-json/wp/v2/media/59`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  return NextResponse.json(data);
}
