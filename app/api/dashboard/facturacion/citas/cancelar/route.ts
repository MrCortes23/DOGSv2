import { NextResponse, NextRequest } from 'next/server'
import { checkAuth, requireAuth, getPool } from '../../utils'

export async function PUT(request: NextRequest) {
  try {
    const userData = await checkAuth()
    if (!userData) {
      return requireAuth()
    }

    const { searchParams } = new URL(request.url)
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
      DELETE FROM factura 
      WHERE id_cita_fk = $1
    `, [citaId])

    // Luego eliminamos la cita
    await pool.query(`
      DELETE FROM cita c
      WHERE c.id_cita_pk = $1 
      AND EXISTS (
        SELECT 1 FROM perro p WHERE p.id_perro_pk = c.id_perro_fk AND p.id_cliente_fk = $2
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
}
