/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from 'react'
import { Perro, Raza } from './types'
import PerroEditForm from './PerroEditForm'

interface PerrosListProps {
  perros: Perro[]
  onDelete: (id: number) => void
  onSave: (formData: FormData) => Promise<void>
  razas: Raza[]
}

export default function PerrosList({ perros, onDelete, onSave, razas }: PerrosListProps) {
  const [editingPerroId, setEditingPerroId] = useState<number | null>(null);

  const handleUpdate = async (formData: FormData) => {
    try {
      await onSave(formData);
      // Refrescar la lista después de la actualización
      window.location.reload();
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Perros Registrados</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {perros.map((perro) => (
          <div key={perro.id_perro_pk} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 relative">
              {perro.foto_data && perro.foto_data.length > 0 ? (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <img 
                    src={`data:image/jpeg;base64,${Buffer.from(perro.foto_data as Buffer).toString('base64')}`}
                    alt={perro.nombre}
                    className="w-full h-full object-cover rounded-t-xl"
                  />
                </div>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-t-xl">
                  <div className="text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    <span className="text-sm">Sin foto</span>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6">
              {editingPerroId === perro.id_perro_pk ? (
                <PerroEditForm
                  perro={{ ...perro, id_perro_pk: perro.id_perro_pk }}
                  razas={razas}
                  onSave={handleUpdate}
                  onCancel={() => setEditingPerroId(null)}
                />
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{perro.nombre}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 mr-2">Edad:</span>
                      <span className="font-medium text-gray-700">{perro.edad}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 mr-2">Sexo:</span>
                      <span className="font-medium text-gray-700">{perro.sexo}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 mr-2">Raza:</span>
                      <span className="font-medium text-gray-700">{perro.raza || 'Sin especificar'}</span>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-4">
                    <button 
                      onClick={() => setEditingPerroId(perro.id_perro_pk)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </button>
                    <button 
                      onClick={() => onDelete(perro.id_perro_pk)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
