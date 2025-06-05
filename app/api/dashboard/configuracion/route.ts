import { NextResponse } from 'next/server';
import  pool  from '@/lib/db';

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const cookies = request.headers.get('cookie');

    if (!cookies) {
      return NextResponse.json(
        { success: false, error: 'No hay sesión activa' },
        { status: 401 }
      );
    }

    // Extraer el ID del usuario de las cookies
    const userCookieMatch = cookies.match(/user=([^;]+)/);
    if (!userCookieMatch) {
      return NextResponse.json(
        { success: false, error: 'No hay sesión activa' },
        { status: 401 }
      );
    }

    // Decodificar y parsear los datos del usuario
    const userData = JSON.parse(decodeURIComponent(userCookieMatch[1]));
    const userId = userData.id;

    // Primero actualizamos inicio_de_sesion para evitar el trigger
    const updateSesionQuery = `
      UPDATE inicio_de_sesion
      SET correo = $1
      WHERE id_cliente_fk = $2
      RETURNING *;
    `;

    // Luego actualizamos cliente
    const updateClienteQuery = `
      UPDATE cliente 
      SET 
        nombre = $1,
        correo = $2,
        telefono = $3,
        direccion = $4
      WHERE id_cliente_pk = $5
      RETURNING *;
    `;

    const client = await pool.connect();
    let result;
    
    try {
      await client.query('BEGIN');
      
      // 1. Primero actualizamos inicio_de_sesion
      await client.query(updateSesionQuery, [
        data.correo,
        userId
      ]);
      
      // 2. Luego actualizamos cliente (el trigger no hará nada porque ya actualizamos inicio_de_sesion)
      const clienteResult = await client.query(updateClienteQuery, [
        data.nombre,
        data.correo,
        data.telefono,
        data.direccion,
        userId
      ]);
      
      if (clienteResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { success: false, error: 'No se pudo actualizar el perfil' },
          { status: 400 }
        );
      }
      
      await client.query('COMMIT');
      result = clienteResult;
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    // Los valores ya se pasan directamente en las consultas individuales

    // La validación ya se hace dentro de la transacción

    // Actualizar la cookie con los nuevos datos
    const updatedUserData = { ...userData, ...result.rows[0] };
    const updatedCookie = `user=${encodeURIComponent(JSON.stringify(updatedUserData))}`;

    return NextResponse.json(
      { success: true, message: 'Perfil actualizado exitosamente' },
      {
        status: 200,
        headers: {
          'Set-Cookie': updatedCookie,
        },
      }
    );

  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar el perfil' },
      { status: 500 }
    );
  }
}
