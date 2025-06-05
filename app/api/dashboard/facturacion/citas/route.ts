import { NextResponse, NextRequest } from 'next/server'
import { checkAuth, requireAuth, getPool } from '../utils'

export async function GET() {
  try {
    const userData = await checkAuth()
    if (!userData) {
      return requireAuth()
    }

    console.log('Datos del usuario:', userData);
    const pool = getPool()
    const result = await pool.query(`
      SELECT 
        c.id_cita_pk,
        c.fecha,
        c.horario_disponible,
        c.costo_total::numeric::float8 as costo_total,
        c.observaciones,
        c.estado,
        e.nombre as nombre_empleado,
        p.nombre as nombre_perro,
        mp.tipo_metodo as metodo_pago,
        f.fecha_emision as fecha_pago
      FROM cita c
      LEFT JOIN factura f ON c.id_cita_pk = f.id_cita_fk
      LEFT JOIN metodo_de_pago mp ON f.id_pago_fk = mp.id_pago_pk
      JOIN empleado e ON c.id_empleado_fk = e.id_empleado_pk
      JOIN perro p ON c.id_perro_fk = p.id_perro_pk
      WHERE p.id_cliente_fk = $1
      ORDER BY c.fecha ASC
    `, [userData.id]);

    console.log('Resultado de la consulta:', result.rows);
    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error en la consulta:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al obtener las citas',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const url = new URL(request.url)
  const path = url.pathname.split('/')
  const action = path[path.length - 1]

  if (action === 'pagar') {
    try {
      const userData = await checkAuth()
      if (!userData) {
        return requireAuth()
      }

      const { ids, metodoPago } = await request.json()

      const pool = getPool()
      
      // Insertar factura y actualizar estado de la cita
      for (const id of ids) {
        await pool.query(`
          WITH inserted_factura AS (
            INSERT INTO factura (id_cita_fk, id_pago_fk, fecha_emision, detalles_de_servicio)
            SELECT 
              c.id_cita_pk,
              mp.id_pago_pk,
              CURRENT_DATE,
              c.observaciones
            FROM cita c
            JOIN metodo_de_pago mp ON mp.tipo_metodo = $1
            WHERE c.id_cita_pk = $2 AND EXISTS (
              SELECT 1 FROM perro p2 WHERE p2.id_perro_pk = c.id_perro_fk AND p2.id_cliente_fk = $3
            )
            RETURNING id_cita_fk
          )
          UPDATE cita
          SET estado = 'pagada'
          WHERE id_cita_pk IN (SELECT id_cita_fk FROM inserted_factura)
        `, [metodoPago, id, userData.id])
      }

      return NextResponse.json({
        success: true,
        message: 'Citas pagadas exitosamente'
      })
    } catch (error) {
      console.error('Error al pagar citas:', error)
      return NextResponse.json({
        success: false,
        error: 'Error al pagar citas',
        details: error instanceof Error ? error.message : 'Error desconocido'
      }, { status: 500 })
    }
  } else if (action === 'cancelar') {
    try {
      const userData = await checkAuth()
      if (!userData) {
        return requireAuth()
      }

      const searchParams = new URLSearchParams(url.search)
      const citaId = parseInt(searchParams.get('id') || '')

      if (!citaId) {
        return NextResponse.json({
          success: false,
          error: 'ID de cita no proporcionado'
        }, { status: 400 })
      }

      const pool = getPool()
      
      // Primero eliminamos la factura si existe
      await pool.query(`
        DELETE FROM factura f
        WHERE f.id_cita_fk = $1 AND EXISTS (
          SELECT 1 FROM perro p2 WHERE p2.id_perro_fk = c.id_perro_fk AND p2.id_cliente_fk = $2
        )
      `, [citaId, userData.id])

      // Luego eliminamos la cita
      await pool.query(`
        DELETE FROM cita c
        WHERE c.id_cita_pk = $1 AND EXISTS (
          SELECT 1 FROM perro p2 WHERE p2.id_perro_fk = c.id_perro_fk AND p2.id_cliente_fk = $2
        )
      `, [citaId, userData.id])

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
  } else {
    return NextResponse.json({
      success: false,
      error: 'Acción no soportada'
    }, { status: 400 })
  }
}
