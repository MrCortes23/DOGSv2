'use client';

import { useState, useEffect } from 'react';

// Definición de tipos
interface Servicio {
  id_servicio_pk?: number;
  tipo_servicio?: string;
  costo?: number;
  descripcion?: string;
  servicio?: string;
  valor?: number;
}

interface Cita {
  id_cita_pk: number;
  fecha: string;
  horario_disponible: string;
  estado: string;
  nombre_cliente?: string;
  nombre_perro?: string;
  servicios?: Servicio[];
  costo_total?: number;
  observaciones?: string;
  id_cliente_fk?: number;
  id_perro_fk?: number;
  nombre_empleado?: string;
  factura?: {
    id_factura_pk?: number;
    fecha_emision?: string;
    metodo_pago?: string;
    detalles?: string;
  };
}

export default function CitasTab() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  // Función para cargar las citas
  const fetchCitas = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/citas');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cargar las citas');
      }
      const data = await response.json();
      console.log('Datos de citas recibidos:', data);
      // Asegurarse de que los servicios siempre sean un array
      const citasConServicios = data.map((cita: Partial<Cita> & { servicios?: Servicio[] }) => ({
        ...cita,
        servicios: Array.isArray(cita.servicios) ? cita.servicios : []
      }));
      setCitas(citasConServicios);
    } catch (error) {
      console.error('Error al cargar citas:', error);
      alert('No se pudieron cargar las citas. Por favor, intente de nuevo.');
      setCitas([]); // Asegurarse de que citas sea un array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar la eliminación de una cita
  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta cita? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setIsDeleting(id);
      const response = await fetch(`/api/admin/citas`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar la cita');
      }

      // Actualizar el estado local eliminando la cita
      setCitas(citas.filter(cita => cita.id_cita_pk !== id));
      
      // Mostrar mensaje de éxito
      alert('Cita eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar la cita:', error);
      alert('No se pudo eliminar la cita. Por favor, intente de nuevo.');
    } finally {
      setIsDeleting(null);
    }
  };

  // Cargar citas al montar el componente
  useEffect(() => {
    fetchCitas();
  }, []);

  // Filtrar citas por búsqueda y estado
  const citasFiltradas = citas.filter(cita => {
    // Manejar valores nulos o indefinidos
    const nombreCliente = cita.nombre_cliente?.toLowerCase() || '';
    const nombrePerro = cita.nombre_perro?.toLowerCase() || '';
    const idCita = cita.id_cita_pk?.toString() || '';
    
    const coincideBusqueda = 
      nombreCliente.includes(searchTerm.toLowerCase()) ||
      nombrePerro.includes(searchTerm.toLowerCase()) ||
      idCita.includes(searchTerm);
      
    const coincideEstado = filtroEstado === 'todos' || 
      (cita.estado?.toLowerCase() === filtroEstado.toLowerCase());
    
    return coincideBusqueda && coincideEstado;
  });

  // Formatear moneda
  const formatearMoneda = (monto: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(monto);
  };

  // Obtener clase CSS según el estado
  const getClaseEstado = (estado: string) => {
    if (!estado) return 'bg-gray-100 text-gray-800';
    
    const estadoLower = estado.toLowerCase();
    switch (estadoLower) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmada':
        return 'bg-blue-100 text-blue-800';
      case 'completada':
        return 'bg-green-100 text-green-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      case 'pagada':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Mostrar carga
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
        <h2 className="text-2xl font-bold">Gestión de Citas</h2>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar por cliente o perro..."
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="todos">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="pagada">Pagada</option>
          </select>
        </div>
      </div>

      {/* Lista de citas */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {citasFiltradas.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No se encontraron citas que coincidan con la búsqueda
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mascota</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {citasFiltradas.map((cita) => (
                  <tr key={cita.id_cita_pk} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cita.id_cita_pk}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {cita.nombre_cliente}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {cita.nombre_perro}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(cita.fecha).toLocaleDateString('es-MX')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cita.horario_disponible}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cita.costo_total ? formatearMoneda(cita.costo_total) : '$0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getClaseEstado(cita.estado)}`}>
                        {cita.estado ? (cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)) : 'Desconocido'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleDelete(cita.id_cita_pk)}
                        disabled={isDeleting === cita.id_cita_pk}
                        className={`text-red-600 hover:text-red-900 ${isDeleting === cita.id_cita_pk ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={isDeleting === cita.id_cita_pk ? 'Eliminando...' : 'Eliminar cita'}
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