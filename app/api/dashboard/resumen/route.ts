import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/session'

export async function GET(request: Request) {
  try {
    const cookies = request.headers.get('cookie')
    if (!cookies) {
      return NextResponse.json({
        success: false,
        error: 'No hay sesión activa',
        details: 'No se encontraron cookies'
      }, { status: 401 })
    }

    const tokenCookieMatch = cookies.match(/token=([^;]+)/)
    if (!tokenCookieMatch) {
      return NextResponse.json({
        success: false,
        error: 'No hay sesión activa',
        details: 'Token de sesión no encontrado'
      }, { status: 401 })
    }

    const session = await verifySession(decodeURIComponent(tokenCookieMatch[1]))
    const userEmail = session.correo

    if (!userEmail) {
      return NextResponse.json({
        success: false,
        error: 'No hay sesión activa',
        details: 'Sesión inválida'
      }, { status: 401 })
    }

    // Verificar si el usuario existe
    const userQuery = await db.query(
      'SELECT * FROM inicio_de_sesion WHERE correo = $1',
      [userEmail]
    )

    if (userQuery.rows.length === 0) {
      return NextResponse.json({ 
        success: false,
        error: 'Usuario no encontrado',
        details: 'No existe un usuario con este correo'
      }, { status: 404 })
    }

    // Obtener el ID del cliente usando el correo
    const clienteRes = await db.query(
      'SELECT id_cliente_pk FROM cliente WHERE correo = $1',
      [userEmail]
    )

    if (clienteRes.rows.length === 0) {
      return NextResponse.json({ 
        success: false,
        error: 'Cliente no encontrado',
        details: 'No existe un cliente con este correo'
      }, { status: 404 })
    }

    const clienteId = clienteRes.rows[0].id_cliente_pk

    // Obtener los perros del cliente
    const perrosRes = await db.query(
      `
        SELECT 
          p.id_perro_pk,
          p.nombre,
          p.edad,
          p.sexo,
          r.tipo_de_raza as raza
        FROM perro p
        LEFT JOIN perro_raza pr ON p.id_perro_pk = pr.id_perro_fk
        LEFT JOIN raza r ON pr.id_raza_fk = r.id_raza_pk
        WHERE p.id_cliente_fk = $1
      `,
      [clienteId]
    )

    // Obtener las citas del cliente
    const citasRes = await db.query(
      `
        SELECT 
          c.id_cita_pk,
          c.fecha,
          c.horario_disponible,
          c.costo_total,
          c.observaciones,
          e.nombre as empleado,
          p.nombre as perro
        FROM cita c
        LEFT JOIN empleado e ON c.id_empleado_fk = e.id_empleado_pk
        LEFT JOIN perro p ON c.id_perro_fk = p.id_perro_pk
        WHERE c.id_perro_fk IN (
          SELECT id_perro_pk FROM perro WHERE id_cliente_fk = $1
        )
        ORDER BY c.fecha DESC
      `,
      [clienteId]
    )

    return NextResponse.json({
      success: true,
      perros: perrosRes.rows,
      citas: citasRes.rows.map(cita => ({
        ...cita,
        fecha: cita.fecha.toISOString().split('T')[0],
        costo_total: Number(cita.costo_total).toFixed(2)
      }))
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    
    return NextResponse.json({
      success: false,
      error: 'Error al obtener los datos',
      details: errorMessage
    }, { status: 500 })
  }
}
