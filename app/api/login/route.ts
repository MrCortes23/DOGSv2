import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { correo, contrasena } = await request.json();

    if (!correo || !contrasena) {
      return NextResponse.json(
        { error: 'Correo y contraseña son requeridos' },
        { status: 400 }
      );
    }

    const client = await db.connect();
    
    // Verificar si el correo existe en inicio_de_sesion
    const sesion = await client.query(
      'SELECT * FROM inicio_de_sesion WHERE correo = LOWER($1)',
      [correo]
    );

    if (sesion.rows.length === 0) {
      return NextResponse.json(
        { error: 'Correo o contraseña incorrectos' },
        { status: 401 }
      );
    }

    // Verificar si el correo existe en cliente
    const cliente = await client.query(
      'SELECT id_cliente_pk, nombre, correo, telefono, direccion FROM cliente WHERE id_cliente_pk = $1',
      [sesion.rows[0].id_cliente_fk]
    );

    if (cliente.rows.length === 0) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    console.log('Contraseña ingresada:', contrasena);
    console.log('Hash almacenado:', sesion.rows[0].contrasena);

    // Verificar la contraseña usando una consulta directa
    const validPassword = await client.query(
      `SELECT contrasena = crypt($1, contrasena) AS is_valid 
       FROM inicio_de_sesion 
       WHERE id_sesion_pk = $2`,
      [contrasena, sesion.rows[0].id_sesion_pk]
    );
    
    console.log('Resultado de validación:', validPassword.rows[0]);

    if (!validPassword.rows[0]?.is_valid) {
      return NextResponse.json(
        { error: 'Correo o contraseña incorrectos' },
        { status: 401 }
      );
    }

    // Crear un token de sesión
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);

    // Establecer cookies
    const userData = {
      id: cliente.rows[0].id_cliente_pk,
      nombre: cliente.rows[0].nombre,
      correo: cliente.rows[0].correo,
      telefono: cliente.rows[0].telefono || '',
      direccion: cliente.rows[0].direccion || '',
      rol: sesion.rows[0].rol
    };

    const response = NextResponse.json({
      success: true,
      user: userData
    });

    // Establecer cookies
    response.cookies.set('user', JSON.stringify(userData), {
      httpOnly: false, // Necesitamos que sea accesible desde JavaScript
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/', // Aseguramos que la cookie esté disponible en toda la aplicación
      maxAge: 60 * 60 * 24 * 7 // 7 días
    });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/', // Aseguramos que la cookie esté disponible en toda la aplicación
      maxAge: 60 * 60 * 24 * 7 // 7 días
    });

    return response;

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error al iniciar sesión. Por favor, inténtelo de nuevo.' },
      { status: 500 }
    );
  }
}
