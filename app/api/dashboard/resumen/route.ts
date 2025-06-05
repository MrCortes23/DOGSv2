import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

export async function GET(request: Request) {
  try {
    console.log('Iniciando petición GET...')
    
    const cookies = request.headers.get('cookie')
    if (!cookies) {
      return NextResponse.json({
        success: false,
        error: 'No hay sesión activa',
        details: 'No se encontraron cookies'
      }, { status: 401 })
    }

    // Extract the user cookie value
    const userCookieMatch = cookies.match(/user=([^;]+)/)
    if (!userCookieMatch) {
      return NextResponse.json({
        success: false,
        error: 'No hay sesión activa',
        details: 'Cookie de usuario no encontrada'
      }, { status: 401 })
    }

    // Decode and parse the user data
    const userData = JSON.parse(decodeURIComponent(userCookieMatch[1]))
    console.log('Usuario decodificado:', userData)

    const userEmail = userData.correo
    console.log('Correo del usuario:', userEmail)

    // Verificar si el usuario existe
    console.log('Verificando usuario en la base de datos...')
    const userQuery = await pool.query(
      'SELECT * FROM inicio_de_sesion WHERE correo = $1',
      [userEmail]
    )

    console.log('Resultado de la consulta de usuario:', userQuery.rows)

    if (userQuery.rows.length === 0) {
      console.log('Usuario no encontrado en la base de datos')
      return NextResponse.json({ 
        success: false,
        error: 'Usuario no encontrado',
        details: 'No existe un usuario con este correo'
      }, { status: 404 })
    }

    // Obtener el ID del cliente usando el correo
    console.log('Obteniendo ID del cliente...')
    const clienteRes = await pool.query(
      'SELECT id_cliente_pk FROM cliente WHERE correo = $1',
      [userEmail]
    )

    console.log('Resultado de la consulta de cliente:', clienteRes.rows)

    if (clienteRes.rows.length === 0) {
      console.log('Cliente no encontrado en la base de datos')
      return NextResponse.json({ 
        success: false,
        error: 'Cliente no encontrado',
        details: 'No existe un cliente con este correo'
      }, { status: 404 })
    }

    const clienteId = clienteRes.rows[0].id_cliente_pk
    console.log('ID del cliente encontrado:', clienteId)

    // Obtener los perros del cliente
    console.log('Obteniendo perros del cliente...')
    const perrosRes = await pool.query(
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

    console.log('Perros encontrados:', perrosRes.rows)

    // Obtener las citas del cliente
    console.log('Obteniendo citas del cliente...')
    const citasRes = await pool.query(
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

    console.log('Citas encontradas:', citasRes.rows)

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
    console.error('Error completo:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    
    return NextResponse.json({
      success: false,
      error: 'Error al obtener los datos',
      details: errorMessage
    }, { status: 500 })
  }
}
