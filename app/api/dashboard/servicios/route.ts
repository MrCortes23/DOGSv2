import { NextResponse } from 'next/server';
import { Pool } from 'pg';

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
    const result = await pool.query(`
      SELECT 
        s.id_servicio_pk,
        s.tipo_de_servicio,
        c.valor,
        c.descripcion
      FROM servicios s
      JOIN costos c ON s.id_servicio_pk = c.id_servicio_fk
      ORDER BY s.tipo_de_servicio
    `);

    return NextResponse.json({
      success: true,
      servicios: result.rows
    });
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener servicios' },
      { status: 500 }
    );
  }
}
