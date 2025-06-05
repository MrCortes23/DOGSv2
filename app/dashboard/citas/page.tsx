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
    setScheduleError(err instanceof Error ? err.message : 'Error desconocido')
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
      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-700">
          {error}
        </div>
      )}
      {scheduleError && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-700">
          {scheduleError}
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