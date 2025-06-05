"use client"

import React from 'react';

interface ResumenCitasProps {
  citas: Array<{
    id_cita_pk: number;
    costo_total: number;
    pagada: boolean;
  }>;
}

export default function ResumenCitas({ citas }: ResumenCitasProps) {
  if (citas.length === 0) return null;

  const totalCitas = citas.length;
  const citasPagadas = citas.filter(c => c.pagada).length;
  // Calcular el total a pagar (solo de citas no pagadas)
  const totalAPagar = citas
    .filter(c => !c.pagada)
    .reduce((sum, cita) => sum + (Number(cita.costo_total) || 0), 0);
  // Calcular el total general (todas las citas)
  const totalGeneral = citas.reduce((sum, cita) => sum + (Number(cita.costo_total) || 0), 0);

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Resumen de Citas</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-600">Total de Citas</p>
          <p className="text-2xl font-bold text-blue-800">{totalCitas}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-600">Citas Pagadas</p>
          <p className="text-2xl font-bold text-green-800">{citasPagadas}</p>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-600">Total a Pagar</p>
          <p className="text-2xl font-bold text-yellow-800">
            {new Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP'
            }).format(totalAPagar)}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Total General</p>
          <p className="text-2xl font-bold text-gray-800">
            {new Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP'
            }).format(totalGeneral)}
          </p>
        </div>
      </div>
    </div>
  );
}
