import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Rutas protegidas que requieren autenticación
  const protectedPaths = ['/dashboard', '/admin'];
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    // Verificar si existe la cookie de usuario
    const userCookie = request.cookies.get('user');
    
    if (!userCookie) {
      // Redirigir a login si no hay cookie
      const loginUrl = new URL('/login', request.url);
      // Añadir la URL actual como parámetro para redirigir después del login
      loginUrl.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
}
