import { NextResponse } from 'next/server'
import { Pool } from 'pg'

// Verificar si la base de datos está configurada
if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL no está configurado')
  throw new Error('DATABASE_URL no está configurado')
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function GET() {
  try {
    // Verificar conexión a la base de datos
    await pool.query('SELECT 1')
    console.log('Conexión a la base de datos exitosa')

    const razasRes = await pool.query(
      `
        SELECT 
          id_raza_pk,
          tipo_de_raza,
          tamano
        FROM raza
        ORDER BY tipo_de_raza ASC
      `
    )

    console.log('Razas encontradas:', razasRes.rows)

    return NextResponse.json({
      success: true,
      razas: razasRes.rows
    })
  } catch (error) {
    console.error('Error en la API de razas:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
