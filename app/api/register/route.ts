import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  let client;
  try {
    const { nombre, correo, telefono, direccion, contrasena } = await request.json();

    if (!nombre || !correo || !telefono || !direccion || !contrasena) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    client = await db.connect();
    await client.query('BEGIN');

    // 1. Generar hash de la contraseña
    const hashedPassword = await client.query(
      'SELECT crypt($1, gen_salt(\'bf\', 10)) as hash',
      [contrasena]
    );

    // 2. Insertar en la tabla cliente
    const clienteResult = await client.query(
      `INSERT INTO cliente 
       (nombre, correo, telefono, direccion, contrasena) 
       VALUES ($1, LOWER($2), $3, $4, $5) 
       RETURNING id_cliente_pk, nombre, correo`,
      [
        nombre.trim(), 
        correo.toLowerCase().trim(), 
        telefono.trim(), 
        direccion.trim(), 
        hashedPassword.rows[0].hash
      ]
    );

    // 3. Insertar en la tabla inicio_de_sesion
    await client.query(
      `INSERT INTO inicio_de_sesion 
       (correo, contrasena, rol, id_cliente_fk) 
       VALUES ($1, $2, 'cliente', $3)`,
      [
        correo.toLowerCase().trim(), 
        hashedPassword.rows[0].hash, 
        clienteResult.rows[0].id_cliente_pk
      ]
    );

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      user: {
        id: clienteResult.rows[0].id_cliente_pk,
        nombre: clienteResult.rows[0].nombre,
        correo: clienteResult.rows[0].correo,
        rol: 'cliente'
      }
    });

  } catch (error: unknown) {
    if (client) {
      await client.query('ROLLBACK');
    }
    
    console.error('Error en registro:', error);
    
    // Verificar si es un error de PostgreSQL (violación de restricción única)
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      return NextResponse.json(
        { error: 'Este correo ya está registrado' },
        { status: 400 }
      );
    }
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Error desconocido al registrar usuario';
      
    return NextResponse.json(
      { error: `Error al registrar usuario: ${errorMessage}` },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
}