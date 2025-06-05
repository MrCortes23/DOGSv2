import { useState, useEffect, useCallback } from 'react'

export interface Cita {
  id_cita_pk: number;
  fecha: string;
  horario_disponible: string;
  costo_total: number;
  observaciones: string;
  nombre_empleado: string;
  nombre_perro: string;
  estado: string; // Cambiado de pagada a estado
}

export function useFacturacion() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCitas = useCallback(async () => {
    try {
      const response = await fetch(`/api/dashboard/facturacion/citas`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener las citas');
      }

      console.log('Datos recibidos del servidor:', data.data);
      setCitas(data.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  // Llamar fetchCitas al inicio
  useEffect(() => {
    fetchCitas();
  }, [fetchCitas]);

  const refreshCitas = useCallback(async () => {
    try {
      await fetchCitas();
    } catch (error) {
      console.error('Error al refrescar las citas:', error);
    }
  }, [fetchCitas]);

  const pagarCitas = useCallback(async (citaIds: number[], metodoPago: string) => {
    try {
      const response = await fetch(`/api/dashboard/facturacion/citas/pagar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: citaIds, metodoPago }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al pagar las citas');
      }

      await fetchCitas();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error desconocido');
    }
  }, [fetchCitas]);

  const cancelarCita = useCallback(async (citaId: number) => {
    try {
      const response = await fetch(`/api/dashboard/facturacion/citas/cancelar?id=${citaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error al cancelar cita: ${errorData}`);
      }

      await fetchCitas();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error desconocido');
    }
  }, [fetchCitas]);

  useEffect(() => {
    fetchCitas();
  }, [fetchCitas]);

  return {
    citas,
    loading,
    error,
    pagarCitas,
    cancelarCita,
    refreshCitas
  };
}
