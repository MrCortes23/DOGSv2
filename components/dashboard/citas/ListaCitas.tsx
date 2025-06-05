"use client"

import React from 'react';

interface ListaCitasProps {
  citas: Array<{
    id_cita_pk: number;
    fecha: string;
    horario_disponible: string;
    costo_total: number;
    observaciones: string;
    nombre_empleado: string;
    nombre_perro: string;
    pagada: boolean;
    id_perro_fk: number;
  }>;
}

export default function ListaCitas({ citas }: ListaCitasProps) {
  if (citas.length === 0) {
    return (
      <div className="mt-8">
        <p className="text-gray-500 text-center">No hay citas programadas</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-6">Mis Citas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {citas.map((cita) => (
          <div key={cita.id_cita_pk} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">{cita.nombre_perro}</h4>
                </div>
                <div className="flex items-center">
                  <span className={`px-4 py-2 rounded-full text-xs ${
                    cita.pagada 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {cita.pagada ? 'Pagada' : 'Pendiente'}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Fecha:</span>
                  <span className="font-medium text-gray-800">{cita.fecha}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Horario:</span>
                  <span className="font-medium text-gray-800">{cita.horario_disponible}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Empleado:</span>
                  <span className="font-medium text-gray-800">{cita.nombre_empleado}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Costo:</span>
                  <span className="font-medium text-gray-800">{new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP'
                  }).format(cita.costo_total)}</span>
                </div>
                {cita.observaciones && (
                  <div className="mt-2">
                    <span className="text-sm text-gray-500">Observaciones:</span>
                    <p className="mt-1 text-sm text-gray-700">{cita.observaciones}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
