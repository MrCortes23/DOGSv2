"use client"

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import {formatISO}  from 'date-fns';
import { es } from 'date-fns/locale';

interface AgendarCitaProps {
  onSchedule: (fecha: string, horario: string, costo: number, observaciones: string, id_perro: number, id_empleado: number) => void;
  servicios: Array<{ id_servicio_pk: number; tipo_de_servicio: string; valor: number; id_costo_pk: number }>;
  perros: Array<{ id_perro_pk: number; nombre: string; tamano: string }>;
}

export default function AgendarCita({ onSchedule, servicios, perros }: AgendarCitaProps) {
  // Eliminar servicios duplicados basados en id_servicio_pk
  const serviciosUnicos = Array.from(
    new Map(
      servicios.map(servicio => [servicio.id_servicio_pk, servicio])
    ).values()
  );

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [selectedPerroId, setSelectedPerroId] = useState<number | null>(null);
  const [costo, setCosto] = useState<number>(0);
  const [observaciones, setObservaciones] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Función para obtener el costo basado en el servicio y el tamaño del perro
  const getCostoPorServicioYPerro = (servicioId: number, perroId: number): number => {
    const servicio = servicios.find(s => s.id_servicio_pk === servicioId);
    if (!servicio) return 0;

    const perro = perros.find(p => p.id_perro_pk === perroId);
    if (!perro) return servicio.valor;

    // Verificar que el tamaño del perro existe y es válido
    const tamano = perro.tamano?.toLowerCase() || 'pequeño';
    const tamanos: Record<string, number> = {
      'pequeño': 1.0,
      'mediano': 1.2,
      'grande': 1.5
    };

    // Si el tamaño no existe en el registro, usar 1.0 como valor por defecto
    return servicio.valor * (tamanos[tamano as keyof typeof tamanos] || 1.0);
  };

  const handleServiceSelect = (id: number | null): void => {
    setSelectedServiceId(id);
    if (id && selectedPerroId) {
      setCosto(getCostoPorServicioYPerro(id, selectedPerroId));
    } else {
      setCosto(0);
    }
  };

  const handlePerroSelect = (id: number | null): void => {
    setSelectedPerroId(id);
    if (id && selectedServiceId) {
      setCosto(getCostoPorServicioYPerro(selectedServiceId!, id));
    } else {
      setCosto(0);
    }
  };

  const handleDateSelect = (date: Date | null): void => {
    if (date) {
      setSelectedDate(date);
      setSelectedTime('');
      setSelectedServiceId(null);
      setCosto(0);
      setObservaciones('');
    }
  };


  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !selectedServiceId || !selectedPerroId) {
      throw new Error('Por favor, complete todos los campos requeridos');
    }

    setLoading(true);

    try {
      await onSchedule(
        formatISO(selectedDate),
        selectedTime,
        costo,
        observaciones,
        selectedPerroId!,
        1 // ID del empleado (debería obtenerse de la sesión)
      );
      
      // Limpiar el formulario después de una cita exitosa
      setSelectedDate(null);
      setSelectedTime('');
      setSelectedServiceId(null);
      setSelectedPerroId(null);
      setCosto(0);
      setObservaciones('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      {loading && (
        <div className="mb-4 p-4 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2"></div>
          <span>Creando cita...</span>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Seleccione una fecha</h3>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <Calendar
            onChange={(value) => handleDateSelect(value instanceof Date ? value : null)}
            value={selectedDate}
            locale={es}
            className="react-calendar"
            tileClassName={(args: { date: Date }) => {
              const { date } = args;
              const isToday = date.toDateString() === new Date().toDateString();
              const isSelected = date.toDateString() === (selectedDate?.toDateString() || '');
              
              return `
                ${isToday ? 'bg-blue-50 text-blue-800 font-semibold' : ''}
                ${isSelected ? 'bg-blue-500 text-white font-semibold' : ''}
                hover:bg-gray-50
                transition-colors
                duration-200
                w-full
                h-full
                flex
                items-center
                justify-center
                rounded-lg
              `;
            }}
            nextLabel={<span className="text-blue-500">›</span>}
            prevLabel={<span className="text-blue-500">‹</span>}
            next2Label={null}
            prev2Label={null}
            minDetail="month"
          />
        </div>
      </div>

      {selectedDate && (
        <div className="bg-white rounded-xl shadow-md p-6 mt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Perro
                </label>
                <select
                  value={selectedPerroId || ''}
                  onChange={(e) => handlePerroSelect(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccione un perro</option>
                  {perros.map((perro) => (
                    <option key={perro.id_perro_pk} value={perro.id_perro_pk}>
                      {perro.nombre} 
                    </option>
                  ))}
                </select>
                {!selectedPerroId && (
                  <p className="text-sm text-red-500 mt-2">Por favor, seleccione un perro primero</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Servicio
                </label>
                <select
                  value={selectedServiceId || ''}
                  onChange={(e) => handleServiceSelect(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!selectedPerroId}
                >
                  <option value="">Seleccione un servicio</option>
                  {serviciosUnicos.map((servicio) => (
                    <option key={servicio.id_servicio_pk} value={servicio.id_servicio_pk}>
                      {servicio.tipo_de_servicio} 
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horario
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccione un horario</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="17:00">05:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones
                </label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Ej: Baño completo con secado"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Costo
                </label>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-800">${costo.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      <span>Creando cita...</span>
                    </div>
                  ) : (
                    'Agendar cita'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
