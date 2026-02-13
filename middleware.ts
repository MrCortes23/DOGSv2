import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/session';

export async function middleware(request: NextRequest) {
  // Rutas protegidas que requieren autenticación
  const protectedPaths = ['/dashboard', '/admin'];
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    const tokenCookie = request.cookies.get('token');

    if (!tokenCookie?.value) {
      // Redirigir a login si no hay cookie
      const loginUrl = new URL('/login', request.url);
      // Añadir la URL actual como parámetro para redirigir después del login
      loginUrl.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const session = await verifySession(tokenCookie.value);

      if (request.nextUrl.pathname.startsWith('/admin')) {
        const role = (session as unknown as { role?: string }).role;
        if (role !== 'administrador') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }
    } catch {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', request.nextUrl.pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('token');
      response.cookies.delete('user');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
}
