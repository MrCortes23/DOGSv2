"use client"

import { useState, useEffect } from 'react'
import { Cita, Servicio } from './types'

interface UseCitasReturn {
  citas: Cita[]
  servicios: Servicio[]
  perros: Array<{ id_perro_pk: number; nombre: string; tamano: string }>
  isLoading: boolean
  error: string | null
  scheduleCita: (data: {
    fecha: string
    horario: string
    costo: number
    observaciones: string
    id_perro: number
    id_empleado: number
  }) => Promise<void>
}

export default function useCitas(): UseCitasReturn {
  const [citas, setCitas] = useState<Cita[]>([])
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [perros, setPerros] = useState<Array<{ id_perro_pk: number; nombre: string; tamano: string }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCitas = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/dashboard/citas', {
        credentials: 'include'
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar las citas')
      }
      if (data.success) {
        setCitas(data.citas)
      } else {
        throw new Error(data.error || 'Error al obtener las citas')
      }
    } catch (error) {
      console.error('No hay sesion activa:', error instanceof Error ? error.message : error)
      setError('No hay sesion activa')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchServicios = async () => {
    try {
      const response = await fetch('/api/dashboard/servicios', {
        credentials: 'include'
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar los servicios')
      }
      if (data.success) {
        setServicios(data.servicios)
      } else {
        throw new Error(data.error || 'Error al obtener los servicios')
      }
    } catch (error) {
      console.error('Error al cargar los servicios:', error instanceof Error ? error.message : error)
      setError('Error al cargar los servicios. Por favor, inténtelo de nuevo.')
    }
  }

  const fetchPerros = async () => {
    try {
      const response = await fetch('/api/dashboard/perros', {
        credentials: 'include'
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar los perros')
      }
      if (data.success) {
        setPerros(data.perros.map((p: { id_perro_pk: number; nombre: string; tamano: string }) => ({
          id_perro_pk: p.id_perro_pk,
          nombre: p.nombre,
          tamano: p.tamano
        })))
      } else {
        throw new Error(data.error || 'Error al obtener los perros')
      }
    } catch (error) {
      console.error('Error al cargar los perros:', error instanceof Error ? error.message : error)
      setError('Error al cargar los perros. Por favor, inténtelo de nuevo.')
    }
  }

  const scheduleCita = async (data: {
    fecha: string
    horario: string
    costo: number
    observaciones: string
    id_perro: number
    id_empleado: number
  }) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/dashboard/citas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          fecha: data.fecha,
          horario_disponible: data.horario,
          costo_total: data.costo,
          observaciones: data.observaciones,
          id_perro_fk: data.id_perro,
          id_empleado_fk: data.id_empleado
        })
      })

      const result = await response.json()
      
      if (!response.ok) {
        if (result.error === 'Horario ocupado') {
          throw new Error('El horario seleccionado ya está ocupado. Por favor, elija otro horario.')
        }
        throw new Error(result.error || 'Error al crear la cita')
      }

      if (!result.success) {
        if (result.error === 'Horario ocupado') {
          throw new Error('El horario seleccionado ya está ocupado. Por favor, elija otro horario.')
        }
        throw new Error(result.error || 'Error al crear la cita')
      }

      // Actualizar la lista de citas
      await fetchCitas()
      setError(null)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      
      if (errorMessage.toLowerCase().includes('horario ocupado')) {
        setError('El horario seleccionado ya está ocupado. Por favor, elija otro horario.')
      } else if (errorMessage.toLowerCase().includes('fecha')) {
        setError('La fecha seleccionada no está disponible.')
      } else {
        setError('Error al crear la cita. Por favor, inténtelo de nuevo.')
      }
      
      console.error('Error detallado:', error instanceof Error ? error.message : error)
      
      // Si hay un error, no actualizamos la lista de citas
      return
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCitas()
    fetchServicios()
    fetchPerros()
  }, [])

  return {
    citas,
    servicios,
    perros,
    isLoading,
    error,
    scheduleCita
  }
}
