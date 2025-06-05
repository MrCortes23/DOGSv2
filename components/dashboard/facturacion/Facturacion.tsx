"use client"

import React, { useState } from 'react';
import TarjetaCita from './TarjetaCita';
import MetodoPago from './MetodoPago';
import { useFacturacion } from './useFacturacion';
import { useToast } from './Toast';

export default function Facturacion() {
  const [citasSeleccionadas, setCitasSeleccionadas] = useState<Set<number>>(new Set());
  const [metodoPago, setMetodoPago] = useState<string>('');
  const [isPaying, setIsPaying] = useState(false);
  const { citas, loading, error, pagarCitas, cancelarCita, refreshCitas } = useFacturacion();
  const { addMessage } = useToast();

  const handlePagarCitas = async () => {
    try {
      if (!metodoPago) {
        addMessage('Por favor, seleccione un método de pago', 'error');
        return;
      }

      const ids = Array.from(citasSeleccionadas);
      if (ids.length === 0) {
        addMessage('Por favor, seleccione al menos una cita para pagar', 'error');
        return;
      }

      // Mostrar mensaje de carga
      addMessage('Procesando pago...', 'loading');
      setIsPaying(true);

      // Realizar el pago
      console.log('Enviando método de pago:', metodoPago);
      await pagarCitas(ids, metodoPago);
      
      // Limpiar selección y método de pago
      setCitasSeleccionadas(new Set());
      setMetodoPago('');
      
      // Refrescar las citas inmediatamente
      await refreshCitas();
      
      // Mostrar mensaje de éxito
      addMessage('Pago realizado exitosamente', 'success');
    } catch (error) {
      console.error('Error detallado:', error);
      addMessage('Error al pagar las citas: ' + (error instanceof Error ? error.message : 'Error desconocido'), 'error');
    } finally {
      setIsPaying(false);
    }
  };

  const handleCancelarCita = async (citaId: number) => {
    try {
      await cancelarCita(citaId);
      // Limpiar selección
      setCitasSeleccionadas(new Set());
      // Refrescar las citas
      await refreshCitas();
      addMessage('Cita cancelada exitosamente', 'success');
    } catch (error) {
      console.error('Error detallado:', error);
      addMessage('Error al cancelar la cita: ' + (error instanceof Error ? error.message : 'Error desconocido'), 'error');
    }
  };

  const totalAPagar = Array.from(citasSeleccionadas)
    .reduce((sum: number, citaId: number) => {
      const cita = citas.find(c => c.id_cita_pk === citaId);
      // Solo sumar citas pendientes
      return cita?.estado === 'pendiente' ? sum + (cita?.costo_total || 0) : sum;
    }, 0);

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {loading &&       <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>}
      {error && <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>}

      <h1 className="text-3xl font-bold mb-8">Facturación</h1>

      <div className="space-y-8">
        {/* Citas Pendientes */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Citas Pendientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {citas
              .filter(cita => cita.estado === 'pendiente')
              .map((cita) => (
                <TarjetaCita
                  key={cita.id_cita_pk}
                  cita={cita}
                  isSelected={citasSeleccionadas.has(cita.id_cita_pk)}
                  onToggleSelect={() => {
                    const newSelection = new Set(citasSeleccionadas);
                    if (newSelection.has(cita.id_cita_pk)) {
                      newSelection.delete(cita.id_cita_pk);
                    } else {
                      newSelection.add(cita.id_cita_pk);
                    }
                    setCitasSeleccionadas(newSelection);
                  }}
                  onCancelar={() => handleCancelarCita(cita.id_cita_pk)}
                />
              ))}
          </div>
        </div>

        {/* Formulario de Pago */}
        {totalAPagar > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Método de pago</h3>
              <MetodoPago
                value={metodoPago}
                onChange={setMetodoPago}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">Total a pagar: ${totalAPagar.toFixed(2)}</span>
              <button
                onClick={handlePagarCitas}
                disabled={isPaying || !metodoPago}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPaying ? 'Procesando...' : 'Pagar'}
              </button>
            </div>
          </div>
        )}

        {/* Citas Pagadas */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Citas Pagadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {citas
              .filter(cita => cita.estado === 'pagada')
              .map((cita) => (
                <TarjetaCita
                  key={cita.id_cita_pk}
                  cita={cita}
                  isSelected={false}
                  onToggleSelect={() => {}}
                  onCancelar={() => handleCancelarCita(cita.id_cita_pk)}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
