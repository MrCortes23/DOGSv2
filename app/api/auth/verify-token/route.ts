// app/api/auth/verify-token/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'Token no proporcionado' },
        { status: 400 }
      );
    }

    const client = await db.connect();

    try {
      // Verificar si el token es válido y no ha expirado
      const result = await client.query(
        `SELECT id, id_cliente_fk 
         FROM password_reset_tokens 
         WHERE token = $1 AND used = FALSE AND expires_at > NOW()
         LIMIT 1`,
        [token]
      );

      const isValid = result.rows.length > 0;

      return NextResponse.json({
        valid: isValid,
        error: isValid ? undefined : 'Token inválido o expirado'
      });

    } catch (error) {
      console.error('Error al verificar el token:', error);
      return NextResponse.json(
        { valid: false, error: 'Error al verificar el token' },
        { status: 500 }
      );
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error en el proceso de verificación:', error);
    return NextResponse.json(
      { valid: false, error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}