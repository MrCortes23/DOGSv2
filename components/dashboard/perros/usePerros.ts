"use client"

import { useState, useEffect } from 'react'
import { Perro, Raza } from './types'

interface UsePerrosReturn {
  perros: Perro[]
  razas: Raza[]
  isLoading: boolean
  error: string | null
  registerPerro: (formData: FormData) => Promise<void>
  updatePerro: (formData: FormData) => Promise<void>
  deletePerro: (id: number) => Promise<void>
}

export default function usePerros(): UsePerrosReturn {
  const [perros, setPerros] = useState<Perro[]>([])
  const [razas, setRazas] = useState<Raza[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPerros = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Obtener las razas disponibles
      const razasResponse = await fetch('/api/dashboard/razas')
      if (!razasResponse.ok) {
        throw new Error(`Error al obtener razas: ${razasResponse.status}`)
      }
      const razasData = await razasResponse.json()
      if (razasData.success) {
        setRazas(razasData.razas)
      } else {
        throw new Error(razasData.error || 'Error desconocido al obtener razas')
      }

      // Obtener los perros
      const response = await fetch('/api/dashboard/perros')
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Error al obtener los perros')
      }

      // Convertir los buffers de las imágenes
      const perrosConImagenes = data.perros.map((perro: Perro) => ({
        ...perro,
        foto_data: perro.foto_data ? Buffer.from(perro.foto_data) : null
      }))

      setPerros(perrosConImagenes)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }

  const registerPerro = async (formData: FormData) => {
    try {
      const response = await fetch('/api/dashboard/perros', {
        method: 'POST',
        body: formData
      })
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Error al registrar el perro')
      }

      const newPerro = {
        ...result.perro,
        foto_data: result.perro.foto_data ? Buffer.from(result.perro.foto_data) : null
      }

      setPerros(prev => [...prev, newPerro])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar el perro')
    }
  }

  const updatePerro = async (formData: FormData) => {
    try {
      const response = await fetch('/api/dashboard/perros', {
        method: 'PUT',
        body: formData
      })
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Error al actualizar el perro')
      }

      const updatedPerro = {
        ...result.perro,
        foto_data: result.perro.foto_data ? Buffer.from(result.perro.foto_data) : null
      }

      // Encontrar el ID del perro en el formData
      const idPerro = formData.get('id_perro_pk')
      if (!idPerro) {
        throw new Error('ID del perro no encontrado en los datos de formulario')
      }

      const perroActualizado = perros.find(p => p.id_perro_pk.toString() === idPerro.toString())
      if (perroActualizado) {
        const formData = new FormData()
        formData.append('id_perro_pk', perroActualizado.id_perro_pk.toString())
        formData.append('nombre', perroActualizado.nombre)
        formData.append('edad', perroActualizado.edad.toString())
        formData.append('sexo', perroActualizado.sexo)
        if (perroActualizado.id_raza_fk) {
          formData.append('id_raza_fk', perroActualizado.id_raza_fk.toString())
        }
        // Si hay foto_data, agregarla al FormData
        if (perroActualizado.foto_data) {
          formData.append('foto', new Blob([perroActualizado.foto_data], { type: 'image/jpeg' }))
        } else {
          // Si no hay foto_data pero existe foto_actual, mantener la foto actual
          formData.append('foto_actual', 'true')
        }
      }

      setPerros(prev => 
        prev.map(p => p.id_perro_pk.toString() === idPerro.toString() ? updatedPerro : p)
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el perro')
    }
  }

  const deletePerro = async (id: number) => {
    try {
      const response = await fetch(`/api/dashboard/perros?id_perro_pk=${id}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || 'Error al eliminar el perro')
      }
      // Actualizar el estado local
      setPerros(perros.filter(p => p.id_perro_pk !== id))
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    fetchPerros()
  }, [])

  return {
    perros,
    razas,
    isLoading,
    error,
    registerPerro,
    updatePerro,
    deletePerro
  }
}