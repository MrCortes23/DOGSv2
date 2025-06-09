import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const query = 'SELECT * FROM enfermedades ORDER BY tipo_de_enfermedad';
    const result = await pool.query(query);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching enfermedades:', error);
    return NextResponse.json(
      { error: 'Error al obtener las enfermedades' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const client = await pool.connect();
  
  try {
    const { tipo_de_enfermedad, observaciones } = await request.json();
    
    if (!tipo_de_enfermedad) {
      return NextResponse.json(
        { error: 'El tipo de enfermedad es requerido' },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO enfermedades (tipo_de_enfermedad, observaciones)
      VALUES ($1, $2)
      RETURNING *
    `;
    
    const result = await client.query(query, [tipo_de_enfermedad, observaciones || null]);
    await client.query('COMMIT');
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating enfermedad:', error);
    return NextResponse.json(
      { error: 'Error al crear la enfermedad' },
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
        { error: 'ID de enfermedad es requerido' },
        { status: 400 }
      );
    }
    
    // Verificar si hay perros asociados a esta enfermedad
    const checkQuery = 'SELECT id_perro_fk FROM perro_enfermedad WHERE id_enfermedad_fk = $1 LIMIT 1';
    const checkResult = await client.query(checkQuery, [id]);
    
    if (checkResult.rows.length > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar la enfermedad porque tiene perros asociados' },
        { status: 400 }
      );
    }
    
    // Si no hay perros asociados, proceder con la eliminación
    const deleteQuery = 'DELETE FROM enfermedades WHERE id_enfermedad_pk = $1';
    await client.query(deleteQuery, [id]);
    await client.query('COMMIT');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting enfermedad:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la enfermedad' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
