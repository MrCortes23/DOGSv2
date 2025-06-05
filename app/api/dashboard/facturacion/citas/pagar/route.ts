import { NextResponse, NextRequest } from 'next/server'
import { checkAuth, requireAuth, getPool } from '../../utils'

export async function PUT(request: NextRequest) {
  try {
    const userData = await checkAuth()
    if (!userData) {
      return requireAuth()
    }

    const { ids, metodoPago } = await request.json()
    const pool = getPool()

    // Verificar métodos de pago disponibles
    const metodosDisponibles = await pool.query('SELECT tipo_metodo FROM metodo_de_pago');
    console.log('Métodos de pago disponibles:', metodosDisponibles.rows);
    console.log('Método de pago recibido:', metodoPago);

    // Insertar facturas para todas las citas seleccionadas
    for (const id of ids) {
      // Verificar si la cita existe
      const citaResult = await pool.query(`
        SELECT c.id_cita_pk, c.observaciones 
        FROM cita c
        JOIN perro p2 ON p2.id_perro_pk = c.id_perro_fk
        WHERE c.id_cita_pk = $1 AND p2.id_cliente_fk = $2
      `, [id, userData.id]);

      if (citaResult.rows.length === 0) {
        throw new Error(`Cita con ID ${id} no encontrada o no pertenece al cliente`);
      }

      // Verificar si ya existe una factura para esta cita
      const facturaExistente = await pool.query(`
        SELECT 1 
        FROM factura 
        WHERE id_cita_fk = $1
      `, [id]);

      if (facturaExistente.rows.length > 0) {
        throw new Error(`Ya existe una factura para la cita con ID ${id}`);
      }

      console.log('Cita encontrada:', citaResult.rows[0]);
      
      // Obtener el id_pago_pk del método de pago seleccionado
      const metodoPagoResult = await pool.query(`
        SELECT id_pago_pk, tipo_metodo 
        FROM metodo_de_pago 
        WHERE LOWER(tipo_metodo) = LOWER($1)`,
        [metodoPago]);

      console.log('Resultados de búsqueda:', metodoPagoResult.rows);
      console.log('Valor buscado:', metodoPago);

      if (metodoPagoResult.rows.length === 0) {
        throw new Error(`Método de pago '${metodoPago}' no encontrado`);
      }

      const idPago = metodoPagoResult.rows[0].id_pago_pk;

      // Crear la factura
      const facturaResult = await pool.query(`
        INSERT INTO factura 
        (id_cita_fk, id_pago_fk, fecha_emision, detalles_de_servicio)
        VALUES ($1, $2, CURRENT_DATE, 
          (SELECT observaciones FROM cita WHERE id_cita_pk = $1))
        RETURNING id_cita_fk;`,
        [id, idPago]);

      if (facturaResult.rows.length === 0) {
        throw new Error(`Error al crear la factura para la cita ${id}`);
      }

      // Actualizar el estado de la cita a 'pagada'
      await pool.query(`
        UPDATE cita 
        SET estado = 'pagada'
        WHERE id_cita_pk = $1`,
        [id]);

      console.log(`Factura creada y estado actualizado para cita ${id}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Citas pagadas exitosamente'
    });

  } catch (error) {
    console.error('Error al pagar citas:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Error desconocido',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
