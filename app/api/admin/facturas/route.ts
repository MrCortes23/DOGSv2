import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const query = `
      SELECT 
        f.*,
        c.nombre as nombre_cliente,
        c.correo as correo_cliente,
        p.nombre as nombre_perro,
        ci.fecha as fecha_cita,
        mp.tipo_metodo as metodo_pago,
        (
          SELECT json_agg(jsonb_build_object(
            'servicio', s.tipo_de_servicio,
            'precio', co.valor
          ))
          FROM cita_servicio cs
          JOIN servicios s ON cs.id_servicio_fk = s.id_servicio_pk
          JOIN costos co ON co.id_servicio_fk = s.id_servicio_pk
          WHERE cs.id_cita_fk = ci.id_cita_pk
        ) as servicios_detalle
      FROM factura f
      JOIN cita ci ON f.id_cita_fk = ci.id_cita_pk
      JOIN perro p ON ci.id_perro_fk = p.id_perro_pk
      JOIN cliente c ON p.id_cliente_fk = c.id_cliente_pk  -- Join through perro
      JOIN metodo_de_pago mp ON f.id_pago_fk = mp.id_pago_pk
      ORDER BY f.fecha_emision DESC`;

    const result = await pool.query(query);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching facturas:', error);
    return NextResponse.json(
      { error: 'Error al obtener las facturas' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    // Eliminamos la factura
    await pool.query('DELETE FROM factura WHERE id_factura_pk = $1', [id]);
    
    return NextResponse.json({ message: 'Factura eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting factura:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la factura' },
      { status: 500 }
    );
  }
}
