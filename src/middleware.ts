import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Whenever user accesses /admin directly, send them to /admin/login
  if (pathname === '/admin' || pathname === '/admin/' || pathname === '/login') {
    const loginUrl = new URL('/admin/login', request.url);
    const response = NextResponse.redirect(loginUrl);
    // Ensure old session cookie is removed when landing on admin entry
    response.cookies.delete('charmika_token');
    return response;
  }

  // Protect all /admin sub-routes (e.g. /admin/dashboard, /admin/products, /admin/orders)
  if (pathname.startsWith('/admin/') && pathname !== '/admin/login') {
    const token = request.cookies.get('charmika_token')?.value;

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/login'],
};

