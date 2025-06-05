import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import { cookies } from 'next/headers'
import { format } from 'date-fns'

// Verificar si la base de datos está configurada
if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL no está configurado')
  throw new Error('DATABASE_URL no está configurado')
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// Function to get user data from cookie
async function getUserDataFromCookie() {
  try {
    const allCookies = await cookies()
    const userCookie = allCookies.get('user')
    
    if (!userCookie) {
      console.log('No se encontró cookie de usuario')
      return null
    }

    const userData = JSON.parse(decodeURIComponent(userCookie.value))
    if (!userData || !userData.id) {
      console.log('Usuario inválido:', userData)
      return null
    }

    return userData
  } catch (error) {
    console.error('Error al obtener datos de usuario:', error)
    return null
  }
}

export async function GET() {
  try {
    const userData = await getUserDataFromCookie()
    if (!userData) {
      return NextResponse.json({
        success: false,
        error: 'No hay sesión activa',
        details: 'No se encontró cookie de usuario'
      }, { status: 401 })
    }

    const result = await pool.query(`
      SELECT 
        c.id_cita_pk,
        c.fecha,
        c.horario_disponible,
        c.costo_total,
        c.observaciones,
        e.nombre as nombre_empleado,
        p.nombre as nombre_perro,
        f.id_factura_pk IS NOT NULL as pagada
      FROM cita c
      JOIN perro p ON c.id_perro_fk = p.id_perro_pk
      JOIN empleado e ON c.id_empleado_fk = e.id_empleado_pk
      LEFT JOIN factura f ON c.id_cita_pk = f.id_cita_fk
      WHERE p.id_cliente_fk = $1
      ORDER BY c.fecha DESC
    `, [userData.id])

    return NextResponse.json({
      success: true,
      citas: result.rows.map(row => ({
        ...row,
        fecha: format(new Date(row.fecha), 'yyyy-MM-dd')
      }))
    })
  } catch (error) {
    console.error('Error al obtener las citas:', error)
    return NextResponse.json({
      success: false,
      error: 'Error al obtener las citas',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validar datos
    const requiredFields = ['fecha', 'horario_disponible', 'id_perro_fk', 'id_empleado_fk']
    const missingFields = requiredFields.filter(field => !body[field])
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Faltan campos requeridos',
        details: missingFields.join(', ')
      }, { status: 400 })
    }

    // Verificar disponibilidad del horario para el empleado
    const checkResult = await pool.query(`
      SELECT 1 FROM cita 
      WHERE fecha = $1 
      AND horario_disponible = $2
      AND id_empleado_fk = $3
    `, [body.fecha, body.horario_disponible, body.id_empleado_fk])

    // Si el horario está ocupado para este empleado, verificar si es para el mismo perro
    if (checkResult.rows.length > 0) {
      const samePerroResult = await pool.query(`
        SELECT 1 FROM cita 
        WHERE fecha = $1 
        AND horario_disponible = $2 
        AND id_empleado_fk = $3
        AND id_perro_fk = $4
      `, [body.fecha, body.horario_disponible, body.id_empleado_fk, body.id_perro_fk])
      
      if (samePerroResult.rows.length === 0) {
        // Si el horario está ocupado pero no para el mismo perro, permitir la cita
        return NextResponse.json({
          success: true,
          message: 'Horario ocupado pero permitido para otro perro'
        }, { status: 200 })
      }
    }

    // Si el horario está ocupado, verificar si es para el mismo perro
    if (checkResult.rows.length > 0) {
      const samePerroResult = await pool.query(`
        SELECT 1 FROM cita 
        WHERE fecha = $1 
        AND horario_disponible = $2 
        AND id_perro_fk = $3
      `, [body.fecha, body.horario_disponible, body.id_perro_fk])
      
      if (samePerroResult.rows.length === 0) {
        // Si el horario está ocupado pero no para el mismo perro, permitir la cita
        return NextResponse.json({
          success: true,
          message: 'Horario ocupado pero permitido para otro perro'
        }, { status: 200 })
      }
    }



    // Crear la cita
    const createResult = await pool.query(`
      INSERT INTO cita (
        fecha,
        horario_disponible,
        costo_total,
        observaciones,
        id_perro_fk,
        id_empleado_fk
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id_cita_pk
    `, [
      body.fecha,
      body.horario_disponible,
      body.costo_total,
      body.observaciones,
      body.id_perro_fk,
      body.id_empleado_fk
    ])

    // Obtener los datos completos de la cita recién creada
    const citaResult = await pool.query(`
      SELECT 
        c.id_cita_pk,
        c.fecha,
        c.horario_disponible,
        c.costo_total,
        c.observaciones,
        e.nombre as nombre_empleado,
        p.nombre as nombre_perro,
        f.id_factura_pk IS NOT NULL as pagada
      FROM cita c
      JOIN perro p ON c.id_perro_fk = p.id_perro_pk
      JOIN empleado e ON c.id_empleado_fk = e.id_empleado_pk
      LEFT JOIN factura f ON c.id_cita_pk = f.id_cita_fk
      WHERE c.id_cita_pk = $1
    `, [createResult.rows[0].id_cita_pk])

    return NextResponse.json({
      success: true,
      cita: citaResult.rows[0]
    })
  } catch (error) {
    console.error('Error al crear la cita:', error)
    return NextResponse.json({
      success: false,
      error: 'Error al crear la cita',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID de cita requerido'
      }, { status: 400 })
    }

    // Verificar si la cita tiene una factura asociada
    const facturaResult = await pool.query(`
      SELECT 1 FROM factura 
      WHERE id_cita_fk = $1
    `, [id])

    if (facturaResult.rows.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'No se puede cancelar una cita que ya tiene factura'
      }, { status: 400 })
    }

    // Eliminar la cita
    await pool.query(`
      DELETE FROM cita 
      WHERE id_cita_pk = $1
    `, [id])

    return NextResponse.json({
      success: true,
      message: 'Cita cancelada exitosamente'
    })
  } catch (error) {
    console.error('Error al cancelar cita:', error)
    return NextResponse.json({
      success: false,
      error: 'Error al cancelar cita',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID de cita requerido'
      }, { status: 400 })
    }

    const body = await request.json()
    
    // Validar datos
    const requiredFields = ['id_pago_fk']
    const missingFields = requiredFields.filter(field => !body[field])
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Faltan campos requeridos',
        details: missingFields.join(', ')
      }, { status: 400 })
    }

    // Crear factura
    const createResult = await pool.query(`
      INSERT INTO factura (
        id_cita_fk,
        id_pago_fk,
        fecha_emision,
        detalles_de_servicio
      ) VALUES ($1, $2, CURRENT_DATE, $3)
      RETURNING id_factura_pk
    `, [
      id,
      body.id_pago_fk,
      body.detalles_de_servicio
    ])

    return NextResponse.json({
      success: true,
      factura: {
        id_factura_pk: createResult.rows[0].id_factura_pk
      }
    })
  } catch (error) {
    console.error('Error al crear factura:', error)
    return NextResponse.json({
      success: false,
      error: 'Error al crear factura',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}
