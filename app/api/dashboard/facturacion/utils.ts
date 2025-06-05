import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Pool } from 'pg';

let pool: Pool | null = null;

export async function checkAuth() {
  try {
    const allCookies = await cookies();
    const userCookie = allCookies.get('user');
    
    if (!userCookie) {
      console.log('No se encontró cookie de usuario');
      return null;
    }

    const userData = JSON.parse(decodeURIComponent(userCookie.value));
    if (!userData || !userData.id) {
      console.log('Usuario inválido:', userData);
      return null;
    }

    return userData;
  } catch (error) {
    console.error('Error al obtener datos de usuario:', error);
    return null;
  }
}

export function requireAuth() {
  return NextResponse.json({
    success: false,
    error: 'No hay sesión activa',
    details: 'No se encontró cookie de usuario'
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
