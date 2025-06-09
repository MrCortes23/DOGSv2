import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const query = 'SELECT * FROM raza ORDER BY tipo_de_raza';
    const result = await pool.query(query);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching razas:', error);
    return NextResponse.json(
      { error: 'Error al obtener las razas' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    const { tipo_de_raza, tamano, caracteristicas } = await request.json();
    
    if (!tipo_de_raza) {
      return NextResponse.json(
        { error: 'El tipo de raza es requerido' },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO raza (tipo_de_raza, tamano, caracteristicas)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const result = await client.query(query, [tipo_de_raza, tamano || null, caracteristicas || null]);
    await client.query('COMMIT');
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating raza:', error);
    return NextResponse.json(
      { error: 'Error al crear la raza' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function DELETE(request: Request) {
  const client = await pool.connect();
  
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de raza es requerido' },
        { status: 400 }
      );
    }
    
    // Verificar si hay perros asociados a esta raza
    const checkQuery = 'SELECT id_perro_fk FROM perro_raza WHERE id_raza_fk = $1 LIMIT 1';
    const checkResult = await client.query(checkQuery, [id]);
    
    if (checkResult.rows.length > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar la raza porque tiene perros asociados' },
        { status: 400 }
      );
    }
    
    // Si no hay perros asociados, proceder con la eliminación
    const deleteQuery = 'DELETE FROM raza WHERE id_raza_pk = $1';
    await client.query(deleteQuery, [id]);
    await client.query('COMMIT');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting raza:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la raza' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
