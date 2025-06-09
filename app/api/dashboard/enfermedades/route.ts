import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM enfermedades ORDER BY tipo_de_enfermedad')
    return NextResponse.json({ 
      success: true, 
      enfermedades: result.rows 
    })
  } catch (error) {
    console.error('Error al obtener enfermedades:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Error al obtener la lista de enfermedades' 
    }, { status: 500 })
  }
}
