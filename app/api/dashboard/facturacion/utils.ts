import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Pool } from 'pg';
import { verifySession } from '@/lib/session';

let pool: Pool | null = null;

export async function checkAuth() {
  try {
    const allCookies = await cookies();
    const tokenCookie = allCookies.get('token');
    
    if (!tokenCookie?.value) {
      return null;
    }

    const session = await verifySession(tokenCookie.value);
    return session;
  } catch {
    return null;
  }
}

export function requireAuth() {
  return NextResponse.json({
    success: false,
    error: 'No hay sesión activa',
    details: 'No se encontró token de sesión'
  }, { status: 401 });
}

export function getPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      console.error('Error: DATABASE_URL no está configurado');
      throw new Error('DATABASE_URL no está configurado');
    }
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
  return pool;
}
