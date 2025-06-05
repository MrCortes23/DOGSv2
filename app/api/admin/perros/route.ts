import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const query = `
      SELECT 
        p.*,
        c.nombre as nombre_cliente,
        c.correo as correo_cliente,
        (
          SELECT json_agg(jsonb_build_object(
            'tipo_enfermedad', e.tipo_de_enfermedad,
            'fecha_diagnostico', pe.fecha_diagnostico,
            'observaciones', e.observaciones
          ))
          FROM perro_enfermedad pe
          JOIN enfermedades e ON pe.id_enfermedad_fk = e.id_enfermedad_pk
          WHERE pe.id_perro_fk = p.id_perro_pk
        ) as enfermedades,
        (
          SELECT json_agg(r.tipo_de_raza)
          FROM perro_raza pr
          JOIN raza r ON pr.id_raza_fk = r.id_raza_pk
          WHERE pr.id_perro_fk = p.id_perro_pk
        ) as razas
      FROM perro p
      JOIN cliente c ON p.id_cliente_fk = c.id_cliente_pk
      ORDER BY p.nombre`;

    const result = await pool.query(query);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching perros:', error);
    return NextResponse.json(
      { error: 'Error al obtener los perros' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const client = await pool.connect();
  
  try {
    const { id } = await request.json();
    
    // Iniciamos una transacción
    await client.query('BEGIN');
    
    try {
      // 1. Obtener los IDs de las citas del perro para eliminaciones posteriores
      const citasResult = await client.query(
        'SELECT id_cita_pk FROM cita WHERE id_perro_fk = $1',
        [id]
      );
      const citasIds = citasResult.rows.map(row => row.id_cita_pk);

      // 2. Si hay citas, eliminar primero las facturas relacionadas
      if (citasIds.length > 0) {
        // 2.1. Eliminar facturas relacionadas con las citas
        await client.query(`
          DELETE FROM factura 
          WHERE id_cita_fk = ANY($1::integer[])
        `, [citasIds]);
      }

      // 3. Eliminar relaciones en cita_servicio para las citas de este perro
      if (citasIds.length > 0) {
        await client.query(`
          DELETE FROM cita_servicio 
          WHERE id_cita_fk = ANY($1::integer[])
        `, [citasIds]);
      }
      
      // 4. Ahora podemos eliminar las citas del perro
      await client.query('DELETE FROM cita WHERE id_perro_fk = $1', [id]);
      
      // 5. Eliminar relaciones con enfermedades
      await client.query('DELETE FROM perro_enfermedad WHERE id_perro_fk = $1', [id]);
      
      // 6. Eliminar relaciones con razas
      await client.query('DELETE FROM perro_raza WHERE id_perro_fk = $1', [id]);
      
      // 7. Finalmente eliminar el perro
      await client.query('DELETE FROM perro WHERE id_perro_pk = $1', [id]);
      
      // Si todo salió bien, hacemos commit
      await client.query('COMMIT');
      
      return NextResponse.json({ message: 'Perro eliminado exitosamente' });
    } catch (error) {
      // Si hay algún error, hacemos rollback
      await client.query('ROLLBACK');
      throw error; // Relanzamos el error para manejarlo en el catch externo
    }
  } catch (error) {
    console.error('Error deleting perro:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el perro: ' + (error as Error).message },
      { status: 500 }
    );
  } finally {
    // Aseguramos que siempre se libere el cliente de la conexión
    client.release();
  }
}
