"use client"

import React from 'react';
import AgendarCita from './AgendarCita';
import ListaCitas from './ListaCitas';
import ResumenCitas from './ResumenCitas';

interface CitasProps {
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
  onSchedule: (fecha: string, horario: string, costo: number, observaciones: string, id_perro: number, id_empleado: number) => void;
  servicios: Array<{ id_servicio_pk: number; tipo_de_servicio: string; valor: number; id_costo_pk: number }>;
  perros: Array<{ id_perro_pk: number; nombre: string; tamano: string }>;
}

export default function Citas({ citas, onSchedule, servicios, perros }: CitasProps) {
  return (
    <div className="p-6 bg-white  min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Calendario de Citas</h2>
        
        <AgendarCita 
          onSchedule={onSchedule}
          servicios={servicios}
          perros={perros}
        />

        <ListaCitas citas={citas} />
        <ResumenCitas citas={citas} />
      </div>
    </div>
  );
}
