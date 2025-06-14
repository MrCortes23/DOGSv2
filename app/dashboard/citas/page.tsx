"use client"

import { useState } from 'react'
import Citas from '@/components/dashboard/citas/Citas'
import useCitas from '@/components/dashboard/citas/useCitas'

export default function Page() {
  const { citas, servicios, perros, isLoading, error, scheduleCita } = useCitas()
  const [scheduleError, setScheduleError] = useState<string | null>(null)

  // Manejo de errores de programación de citas
  const handleScheduleError = (err: unknown) => {
    console.error('Error al programar cita:', err)
    let errorMessage = 'Error al agendar la cita';
    
    if (err instanceof Error) {
      errorMessage = err.message;
    } else if (typeof err === 'string') {
      errorMessage = err;
    } else if (err && typeof err === 'object' && 'message' in err) {
      errorMessage = String(err.message);
    }
    
    // Mostrar el mensaje de error en la interfaz
    setScheduleError(errorMessage);
    
    // Limpiar el mensaje de error después de 5 segundos
    setTimeout(() => {
      setScheduleError(null);
    }, 5000);
  }

  // Renderizado
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mis Citas</h1>
      {(error || scheduleError) && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 border-l-4 border-red-500">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-base font-semibold text-red-800">No se pudo agendar la cita</h3>
              <div className="mt-1 text-sm text-red-700">
                <p>{error || scheduleError}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <Citas
        citas={citas}
        onSchedule={(fecha, horario, costo, observaciones, id_perro, id_empleado) => 
          scheduleCita({
            fecha,
            horario,
            costo,
            observaciones,
            id_perro,
            id_empleado
          }).catch(handleScheduleError)
        }
        servicios={servicios}
        perros={perros}
      />
    </div>
  )
}