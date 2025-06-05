'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface Servicio {
  id_servicio_pk?: number | string;
  id_servicio?: number | string;
  nombre?: string;
  descripcion?: string;
  precio?: number;
  duracion?: number;
}

interface Mascota {
  id_perro_pk?: number | string;
  id_perro?: number | string;  // Alias para compatibilidad
  nombre: string;
  edad?: string;
  sexo?: string;
  id_cliente_fk?: number | string;
  foto_data?: string | ArrayBuffer | null;
  raza?: string;
  peso?: number;
  fecha_nacimiento?: string;
}

interface Cita {
  id_cita_pk?: number | string;
  id_cita?: number | string;  // Alias para compatibilidad
  estado: string;
  fecha?: string;
  horario_disponible?: string;
  id_perro_fk?: number | string;
  id_empleado_fk?: number | string;
  costo_total?: number;
  observaciones?: string;
  servicios?: Servicio[];
  // Propiedades adicionales específicas de la cita
  motivo_consulta?: string;
  diagnostico?: string;
  tratamiento?: string;
}

interface Cliente {
  id_cliente_pk: number;
  id_cliente?: number;  // Alias para compatibilidad
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  contrasena?: string;
  perros: Mascota[];
  citas: Cita[];
}

export default function ClientesTab() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchClientes = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/clientes');
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error en la respuesta:', response.status, errorData);
        throw new Error('Error al cargar los clientes');
      }
      const data = await response.json();
      
      // Asegurarse de que los datos tengan la estructura correcta
      const clientesProcesados = data.map((cliente: Partial<Cliente> & { id?: number | string }) => {
        // Extraer el ID del cliente (puede venir como id o id_cliente_pk)
        const idCliente = Number(cliente.id || cliente.id_cliente_pk);
        
        if (isNaN(idCliente) || idCliente <= 0) {
          console.warn('Cliente con ID inválido:', cliente);
          return null;
        }
        
        return {
          ...cliente,
          id_cliente_pk: idCliente,
          perros: (Array.isArray(cliente.perros) ? cliente.perros : []).map((perro: Partial<Mascota> & { id_perro?: number | string }) => ({
            ...perro,
            id_perro_pk: Number(perro.id_perro_pk || perro.id_perro || 0),
            id_perro: Number(perro.id_perro || perro.id_perro_pk || 0)
          })).filter((p) => p.id_perro_pk > 0),
          citas: (Array.isArray(cliente.citas) ? cliente.citas : []).map((cita: Partial<Cita> & { id_cita?: number | string }) => ({
            ...cita,
            id_cita_pk: Number(cita.id_cita_pk || cita.id_cita || 0),
            id_cita: Number(cita.id_cita || cita.id_cita_pk || 0),
            servicios: (Array.isArray(cita.servicios) ? cita.servicios : []).map((servicio: Partial<Servicio> & { id_servicio?: number | string }) => ({
              ...servicio,
              id_servicio_pk: Number(servicio.id_servicio_pk || servicio.id_servicio || 0),
              id_servicio: Number(servicio.id_servicio || servicio.id_servicio_pk || 0)
            })).filter((s: Partial<Servicio> & { id_servicio_pk: number }) => s.id_servicio_pk > 0)
          })).filter((c: Partial<Cita> & { id_cita_pk: number }) => c.id_cita_pk > 0)
        };
      });
      
      // Filtrar clientes nulos y con IDs válidos
      const clientesValidos = clientesProcesados.filter((cliente: Cliente | null): cliente is Cliente => 
        cliente !== null && cliente.id_cliente_pk > 0
      ) as Cliente[];
      
      console.log('Clientes cargados:', clientesValidos);
      setClientes(clientesValidos);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los clientes',
        className: 'bg-red-100 border-red-400 text-red-700',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const handleDelete = async (id: number | string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.')) {
      return;
    }

    // Convertir el ID a número si es un string numérico
    let idNumerico: number | null = null;
    
    if (typeof id === 'string') {
      if (/^\d+$/.test(id)) {
        idNumerico = parseInt(id, 10);
      } else if (id.startsWith('temp-')) {
        // Manejar ID temporal
        console.log('ID temporal detectado, eliminando del estado local');
        setClientes(prev => prev.filter(c => c.id_cliente_pk.toString() !== id));
        return;
      }
    } else if (typeof id === 'number') {
      idNumerico = id;
    }

    // Validar que el ID sea un número válido (incluyendo 0)
    if (idNumerico === null || isNaN(idNumerico) || idNumerico < 0) {
      console.error('ID de cliente no válido:', id);
      toast({
        title: 'Error',
        description: 'El ID del cliente no es válido',
        className: 'bg-red-100 border-red-400 text-red-700',
      });
      return;
    }

    try {
      console.log('Eliminando cliente con ID:', idNumerico);
      
      const response = await fetch('/api/admin/clientes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: idNumerico }), // Enviar solo el ID numérico
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error en la respuesta:', response.status, errorData);
        throw new Error(errorData || 'Error al eliminar el cliente');
      }

      // Actualizar el estado local para eliminar el cliente de la lista
      setClientes(prevClientes => prevClientes.filter(cliente => 
        cliente.id_cliente_pk !== idNumerico
      ));

      toast({
        title: 'Éxito',
        description: 'Cliente eliminado correctamente',
        className: 'bg-green-100 border-green-400 text-green-700',
      });
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo eliminar el cliente',
        className: 'bg-red-100 border-red-400 text-red-700',
      });
    }
  };

  const filteredClientes = clientes.filter((cliente) =>
    cliente.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cliente.telefono?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
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
        <h2 className="text-2xl font-bold">Clientes Registrados</h2>
        
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Buscar por nombre, correo o teléfono..."
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de clientes */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredClientes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No se encontraron clientes que coincidan con la búsqueda
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mascotas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Citas</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClientes.map((cliente, index) => (
                  <tr key={`cliente-${cliente.id_cliente_pk || `temp-${index}`}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{cliente.nombre}</div>
                      <div className="text-sm text-gray-500">
                        ID: {cliente.id_cliente_pk}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-900">{cliente.correo}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {cliente.telefono || 'Sin teléfono'}
                        </span>
                      </div>
                      {cliente.direccion && (
                        <div className="mt-1">
                          <span className="text-sm text-gray-500">
                            {cliente.direccion}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900">{cliente.perros?.length || 0} mascotas</span>
                      {cliente.perros?.length > 0 ? (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {cliente.perros.slice(0, 3).map((perro, perroIndex) => (
                            <span 
                              key={`perro-${cliente.id_cliente_pk}-${perro.id_perro_pk || perro.id_perro || perroIndex}`}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {perro.nombre}
                            </span>
                          ))}
                          {cliente.perros.length > 3 && (
                            <span 
                              key={`mas-perros-${cliente.id_cliente_pk}-${cliente.perros.length}`}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              +{cliente.perros.length - 3} más
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500"></span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900">
                          {cliente.citas?.length || 0} citas
                        </div>
                        {cliente.citas && cliente.citas.length > 0 ? (
                          <div className="space-y-1 mt-1">
                            {cliente.citas.slice(0, 2).map((cita, citaIndex) => (
                              <div 
                                key={`cita-${cliente.id_cliente_pk}-${cita.id_cita_pk || cita.id_cita || citaIndex}`}
                                className="text-xs p-1.5 rounded border border-gray-100 bg-gray-50"
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">
                                    {cita.fecha ? new Date(cita.fecha).toLocaleDateString() : 'Sin fecha'}
                                  </span>
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                                    cita.estado?.toLowerCase() === 'pagada' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {cita.estado || 'pendiente'}
                                  </span>
                                </div>
                                {cita.horario_disponible && (
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    {cita.horario_disponible}
                                  </div>
                                )}
                              </div>
                            ))}
                            {cliente.citas.length > 2 && (
                              <div className="text-xs text-gray-500 mt-1">
                                +{cliente.citas.length - 2} más...
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500">No hay citas programadas</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleDelete(cliente.id_cliente_pk)}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar cliente"
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
