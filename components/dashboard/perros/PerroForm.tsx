"use client"

import React from 'react'

import { Raza } from './types'

interface PerroFormProps {
  onSubmit: (formData: FormData) => Promise<void>
  razas: Raza[]
}

export default function PerroForm({ onSubmit, razas }: PerroFormProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Obtener los valores del formulario
    const nombre = e.currentTarget.nombre.value
    const edad = e.currentTarget.edad.value
    const sexo = e.currentTarget.sexo.value
    const id_raza_fk = e.currentTarget.id_raza_fk.value
    const foto = e.currentTarget.foto.files?.[0]

    // Validar que todos los campos requeridos estén presentes
    if (!nombre || !edad || !sexo || !id_raza_fk) {
      console.error('Faltan campos requeridos')
      return
    }

    // Convertir edad a número
    const edadNum = parseInt(edad)
    if (isNaN(edadNum)) {
      console.error('Edad inválida')
      return
    }

    // Convertir ID de raza a número
    const idRazaNum = parseInt(id_raza_fk)
    if (isNaN(idRazaNum)) {
      console.error('ID de raza inválido')
      return
    }

    // Crear un nuevo FormData con los valores validados
    const formData = new FormData()
    formData.append('nombre', nombre)
    formData.append('edad', edadNum.toString())
    formData.append('sexo', sexo)
    formData.append('id_raza_fk', idRazaNum.toString())
    if (foto) {
      formData.append('foto', foto)
    }

    await onSubmit(formData)
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Registrar Nuevo Perro</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
            <input
              type="text"
              name="nombre"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nombre del perro"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Edad</label>
            <input
              type="number"
              name="edad"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Edad en años"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sexo</label>
            <select
              name="sexo"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona el sexo</option>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Raza</label>
            <select
              name="id_raza_fk"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona una raza</option>
              {razas.map(raza => (
                <option key={raza.id_raza_pk} value={raza.id_raza_pk.toString()}>
                  {raza.tipo_de_raza} ({raza.tamano})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Foto</label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                name="foto"
                accept="image/*"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Registrar Perro
          </button>
        </div>
      </form>
    </div>
  )
}
