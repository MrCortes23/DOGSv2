/* eslint-disable @next/next/no-img-element */
"use client"

import { Perro, Raza } from './types'

interface PerroEditFormProps {
  perro: Perro
  razas: Raza[]
  onSave: (formData: FormData) => Promise<void>
  onCancel: () => void
}

export default function PerroEditForm({ perro, razas, onSave, onCancel }: PerroEditFormProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const formData = new FormData(e.currentTarget)
    await onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="hidden"
        name="id_perro_pk"
        value={perro.id_perro_pk.toString()}
      />
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
          <input
            type="text"
            name="nombre"
            defaultValue={perro.nombre}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Edad</label>
          <input
            type="number"
            name="edad"
            defaultValue={perro.edad}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sexo</label>
          <select
            name="sexo"
            defaultValue={perro.sexo}
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
            defaultValue={perro.id_raza_fk}
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
            {perro.foto_data && (
              <div className="flex items-center gap-2">
                <img 
                  src={`data:image/jpeg;base64,${Buffer.from(perro.foto_data as Buffer).toString('base64')}`}
                  alt={perro.nombre}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <span className="text-sm text-gray-600">Foto actual</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
          >
            Guardar
          </button>
        </div>
      </div>
    </form>
  )
}
