import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const query = `
      SELECT 
        c.*,
        cl.nombre as nombre_cliente,
        cl.correo as correo_cliente,
        p.nombre as nombre_perro,
        e.nombre as nombre_empleado,
        cl.id_cliente_pk as id_cliente_fk,
        (
          SELECT json_build_object(
            'id_factura_pk', f.id_factura_pk,
            'fecha_emision', f.fecha_emision,
            'metodo_pago', mp.tipo_metodo,
            'detalles', f.detalles_de_servicio
          )
          FROM factura f
          JOIN metodo_de_pago mp ON f.id_pago_fk = mp.id_pago_pk
          WHERE f.id_cita_fk = c.id_cita_pk
          LIMIT 1
        ) as factura
      FROM cita c
      JOIN perro p ON c.id_perro_fk = p.id_perro_pk
      JOIN cliente cl ON p.id_cliente_fk = cl.id_cliente_pk
      LEFT JOIN empleado e ON c.id_empleado_fk = e.id_empleado_pk
      ORDER BY c.fecha DESC, c.horario_disponible`;

    const result = await pool.query(query);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching citas:', error);
    return NextResponse.json(
      { error: 'Error al obtener las citas' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    // Iniciar transacción
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // 1. Eliminar facturas asociadas
      await client.query('DELETE FROM factura WHERE id_cita_fk = $1', [id]);
      
      // 2. Eliminar servicios asociados
      await client.query('DELETE FROM cita_servicio WHERE id_cita_fk = $1', [id]);
      
      // 3. Finalmente, eliminar la cita
      await client.query('DELETE FROM cita WHERE id_cita_pk = $1', [id]);
      
      await client.query('COMMIT');
      return new NextResponse(null, { status: 204 });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error deleting cita:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la cita' },
      { status: 500 }
    );
  }
}
