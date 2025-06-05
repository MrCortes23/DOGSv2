"use client"

import { useState, useEffect } from 'react'

interface Perro {
  id_perro_pk: number
  nombre: string
  edad: string
  sexo: string
  raza: string
}

interface Cita {
  id_cita_pk: number
  fecha: string
  horario_disponible: string
  costo_total: number
  observaciones: string
  empleado: string
  perro: string
}

export default function Resumen() {
  const [perros, setPerros] = useState<Perro[]>([])
  const [citas, setCitas] = useState<Cita[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Iniciando fetch de datos...')
        const response = await fetch('/api/dashboard/resumen')
        console.log('Respuesta del servidor:', {
          ok: response.ok,
          status: response.status,
          statusText: response.statusText
        })

        const data = await response.json()
        console.log('Datos recibidos:', data)

        if (!response.ok) {
          throw new Error(data.error || 'Error al obtener los datos')
        }

        setPerros(data.perros)
        setCitas(data.citas)
        setError(null)
      } catch (error) {
        console.error('Error en el componente:', error)
        setError(error instanceof Error ? error.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">Error: {error}</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Resumen */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Resumen</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-900">Perros Registrados</h3>
            <p className="text-3xl font-bold text-blue-600">{perros.length}</p>
          </div>
          <div className="p-4 bg-green-100 rounded-lg">
            <h3 className="text-xl font-semibold text-green-900">Citas</h3>
            <p className="text-3xl font-bold text-green-800">{citas.length}</p>
          </div>
        </div>
      </div>

      {/* Lista de Perros */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Mis Perros</h2>
        <div className="space-y-4">
          {perros.map((perro) => (
            <div key={perro.id_perro_pk} className="p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900">{perro.nombre}</h3>
              <p className="text-gray-600">Edad: {perro.edad}</p>
              <p className="text-gray-600">Sexo: {perro.sexo}</p>
              <p className="text-gray-600">Raza: {perro.raza}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de Citas */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Mis Citas</h2>
        <div className="space-y-4">
          {citas.map((cita) => (
            <div key={cita.id_cita_pk} className="p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{cita.fecha} - {cita.horario_disponible}</h3>
                <span className="text-sm text-gray-600">${cita.costo_total}</span>
              </div>
              <p className="text-gray-600">Perro: {cita.perro}</p>
              <p className="text-gray-600">Veterinario: {cita.empleado}</p>
              {cita.observaciones && (
                <p className="text-gray-600 mt-2">Observaciones: {cita.observaciones}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
