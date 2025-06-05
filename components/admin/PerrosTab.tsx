'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface Enfermedad {
  tipo_enfermedad: string;
  fecha_diagnostico: string;
  observaciones?: string;
}

interface Perro {
  id_perro_pk: number;
  nombre: string;
  edad: number;
  sexo: 'M' | 'H';
  nombre_cliente: string;
  correo_cliente: string;
  razas: string[];
  enfermedades: Enfermedad[];
}

const formatearFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString('es-MX');
};

export default function PerrosTab() {
  const [perros, setPerros] = useState<Perro[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchPerros = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/perros');
      if (!response.ok) throw new Error('Error al cargar los perros');
      const data = await response.json();
      setPerros(data);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los perros',
        className: 'bg-red-100 border-red-400 text-red-700',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPerros();
  }, [fetchPerros]);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este perro? Esta acción no se puede deshacer y también se eliminarán sus citas relacionadas.')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/perros', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Error al eliminar el perro');

      toast({
        title: 'Éxito',
        description: 'Perro eliminado correctamente',
        className: 'bg-green-100 border-green-400 text-green-700',
      });

      // Actualizar la lista de perros
      fetchPerros();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el perro',
        className: 'bg-red-100 border-red-400 text-red-700',
      });
    }
  };

  const filteredPerros = perros.filter((perro) =>
    perro.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    perro.nombre_cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    perro.id_perro_pk?.toString().includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Encabezado y búsqueda */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Mascotas Registradas</h2>
        
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Buscar por nombre, dueño o ID..."
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de perros */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredPerros.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No se encontraron mascotas que coincidan con la búsqueda
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mascota</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dueño</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Información</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Razas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enfermedades</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPerros.map((perro) => (
                  <tr key={perro.id_perro_pk} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full">
                          <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{perro.nombre}</div>
                          <div className="text-sm text-gray-500">ID: {perro.id_perro_pk}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{perro.nombre_cliente}</div>
                      <div className="text-sm text-gray-500">{perro.correo_cliente}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <span className="font-medium">Edad:</span> {perro.edad || 'No especificada'}
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Sexo:</span> {perro.sexo === 'M' ? 'Macho' : 'Hembra'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {perro.razas?.length > 0 ? (
                          perro.razas.map((raza, index) => (
                            <span 
                              key={index} 
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                            >
                              {raza}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">Sin raza</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {perro.enfermedades?.length > 0 ? (
                        <div className="space-y-2">
                          {perro.enfermedades.slice(0, 2).map((enfermedad, index) => (
                            <div key={index} className="flex items-start">
                              <svg className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div className="ml-1">
                                <div className="text-sm text-gray-900">{enfermedad.tipo_enfermedad}</div>
                                <div className="text-xs text-gray-500">
                                  {formatearFecha(enfermedad.fecha_diagnostico)}
                                </div>
                              </div>
                            </div>
                          ))}
                          {perro.enfermedades.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{perro.enfermedades.length - 2} más
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Ninguna</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleDelete(perro.id_perro_pk)}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar mascota"
                      >
                        <svg className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
