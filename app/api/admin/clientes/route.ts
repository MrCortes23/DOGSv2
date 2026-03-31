import { NextResponse } from 'next/server';
import pool from '@/lib/db';

type PerroIdRow = {
  id_perro_pk: number;
};

export async function GET() {
  try {
    // Obtener clientes con sus perros y citas
    const query = `
      WITH citas_cliente AS (
        SELECT 
          p.id_cliente_fk,
          json_agg(
            json_build_object(
              'id_cita_pk', c.id_cita_pk,
              'fecha', c.fecha,
              'horario_disponible', c.horario_disponible,
              'estado', c.estado,
              'costo_total', c.costo_total,
              'observaciones', c.observaciones,
              'id_perro_fk', c.id_perro_fk
            )
            ORDER BY c.fecha DESC, c.horario_disponible
          ) as citas
        FROM cita c
        JOIN perro p ON c.id_perro_fk = p.id_perro_pk
        GROUP BY p.id_cliente_fk
      )
      SELECT 
        c.id_cliente_pk as id,
        c.nombre,
        c.correo,
        c.telefono,
        c.direccion,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id_perro_pk', p.id_perro_pk,
                'nombre', p.nombre,
                'edad', p.edad,
                'sexo', p.sexo
              )
            )
            FROM perro p
            WHERE p.id_cliente_fk = c.id_cliente_pk
          ), '[]'::json
        ) as perros,
        COALESCE(cc.citas, '[]'::json) as citas
      FROM cliente c
      LEFT JOIN citas_cliente cc ON cc.id_cliente_fk = c.id_cliente_pk
      WHERE c.id_cliente_pk > 0  -- Asegurarse de que no se incluyan IDs 0
      ORDER BY c.nombre`;

    const result = await pool.query(query);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching clientes:', error);
    return NextResponse.json(
      { error: 'Error al obtener los clientes' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const client = await pool.connect();
  
  try {
    const body = await request.json();
    
    const { id } = body;
    
    // Validar que el ID sea un número o un string numérico
    if (id === undefined || id === null || (isNaN(Number(id)) && !id.toString().startsWith('temp-'))) {
      console.error('ID de cliente no válido:', id);
      return NextResponse.json(
        { error: 'ID de cliente no válido' },
        { status: 400 }
      );
    }

    // Si es un ID temporal, no hacemos nada en la base de datos
    if (id.toString().startsWith('temp-')) {
      return NextResponse.json({ message: 'Cliente temporal eliminado' });
    }
    
    // Convertir a número para asegurar consistencia
    const clienteId = Number(id);
    
    // Verificar que el ID sea un número positivo
    if (clienteId < 0) {
      console.error('ID de cliente no puede ser negativo:', clienteId);
      return NextResponse.json(
        { error: 'ID de cliente no válido' },
        { status: 400 }
      );
    }
    
    // Iniciar una transacción
    await client.query('BEGIN');
    
    try {
      // 1. Eliminar registros de inicio_de_sesion relacionados
      const sesionesResult = await client.query(
        'DELETE FROM inicio_de_sesion WHERE id_cliente_fk = $1 RETURNING *',
        [id]
      );
      
      // 2. Obtener IDs de perros del cliente
      const perros = await client.query<PerroIdRow>(
        'SELECT id_perro_pk FROM perro WHERE id_cliente_fk = $1',
        [id]
      );
      const idsPerros = perros.rows.map((p: { id_perro_pk: number }) => p.id_perro_pk);
      
      if (idsPerros.length > 0) {
        // 3. Eliminar servicios de citas (cita_servicio) para los perros del cliente
        await client.query(
          `DELETE FROM cita_servicio 
           WHERE id_cita_fk IN (
             SELECT id_cita_pk FROM cita WHERE id_perro_fk = ANY($1::int[])
           ) RETURNING *`,
          [idsPerros]
        );
        
        // 4. Eliminar facturas de los perros del cliente
        await client.query(
          `DELETE FROM factura 
           WHERE id_cita_fk IN (
             SELECT id_cita_pk FROM cita WHERE id_perro_fk = ANY($1::int[])
           ) RETURNING *`,
          [idsPerros]
        );
        
        // 5. Eliminar citas de los perros
        await client.query(
          'DELETE FROM cita WHERE id_perro_fk = ANY($1::int[]) RETURNING *',
          [idsPerros]
        );
        
        // 6. Eliminar relaciones de perros con razas
        await client.query(
          'DELETE FROM perro_raza WHERE id_perro_fk = ANY($1::int[]) RETURNING *',
          [idsPerros]
        );
        
        // 7. Eliminar relaciones de perros con enfermedades
        await client.query(
          'DELETE FROM perro_enfermedad WHERE id_perro_fk = ANY($1::int[]) RETURNING *',
          [idsPerros]
        );
        
        // 8. Eliminar los perros del cliente
        await client.query(
          'DELETE FROM perro WHERE id_cliente_fk = $1 RETURNING *',
          [id]
        );
      }
      
      // 9. Finalmente, eliminar el cliente
      const clienteResult = await client.query(
        'DELETE FROM cliente WHERE id_cliente_pk = $1 RETURNING *',
        [id]
      );
      
      const rowsDeleted = clienteResult.rowCount || 0;
      
      if (rowsDeleted === 0) {
        throw new Error('No se encontró el cliente para eliminar');
      }
      
      // Si todo salió bien, hacer commit
      await client.query('COMMIT');
      
      return NextResponse.json({ 
        success: true,
        message: 'Cliente y todos sus datos relacionados eliminados exitosamente',
        details: {
          cliente: rowsDeleted,
          perros: perros?.rowCount || 0,
          sesiones: sesionesResult?.rowCount || 0
        }
      });
      
    } catch (error) {
      // Si hay algún error, hacer rollback
      console.error('Error en la transacción, haciendo rollback:', error);
      await client.query('ROLLBACK');
      throw error;
    }
    
  } catch (error) {
    console.error('Error eliminando cliente:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error al eliminar el cliente',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  } finally {
    // Asegurarse de liberar el cliente de la pool
    client.release();
  }
}
