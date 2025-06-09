// app/api/auth/update-password/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token y nueva contraseña son requeridos' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    const client = await db.connect();

    try {
      // 1. Verificar token
      const tokenResult = await client.query(
        `SELECT id, id_cliente_fk, expires_at, used 
         FROM password_reset_tokens 
         WHERE token = $1 AND used = FALSE AND expires_at > NOW()
         LIMIT 1`,
        [token]
      );

      if (tokenResult.rows.length === 0) {
        return NextResponse.json(
          { error: 'El enlace de restablecimiento no es válido o ha expirado' },
          { status: 400 }
        );
      }

      const tokenData = tokenResult.rows[0];

      // 2. Actualizar la contraseña usando crypt de PostgreSQL en inicio_de_sesion
      await client.query(
        `UPDATE inicio_de_sesion 
         SET contrasena = crypt($1, gen_salt('bf')) 
         WHERE id_cliente_fk = $2`,
        [newPassword, tokenData.id_cliente_fk]
      );

      // 3. Actualizar la contraseña en la tabla cliente para mantener consistencia
      await client.query(
        `UPDATE cliente 
         SET contrasena = (SELECT contrasena FROM inicio_de_sesion WHERE id_cliente_fk = $1)
         WHERE id_cliente_pk = $1`,
        [tokenData.id_cliente_fk]
      );

      // 4. Marcar el token como usado
      await client.query(
        `UPDATE password_reset_tokens 
         SET used = TRUE 
         WHERE id = $1`,
        [tokenData.id]
      );

      // 5. Invalidar otros tokens del usuario
      await client.query(
        `UPDATE password_reset_tokens 
         SET used = TRUE 
         WHERE id_cliente_fk = $1 AND used = FALSE`,
        [tokenData.id_cliente_fk]
      );

      return NextResponse.json({
        success: true,
        message: 'Contraseña actualizada correctamente'
      });

    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      return NextResponse.json(
        { error: 'Error al actualizar la contraseña' },
        { status: 500 }
      );
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error en el proceso de actualización:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}