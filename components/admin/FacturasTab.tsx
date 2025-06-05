'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../ui/use-toast';

interface Servicio {
  id_servicio_pk?: number;
  tipo_servicio?: string;
  precio?: string | number;
  duracion?: number;
  servicio?: string; // Added to match the API response
  costo?: number;    // Added to match the API response
  descripcion?: string; // Added to match the API response
}

interface Factura {
  id_factura_pk: number;
  id_cita_fk: number;
  fecha_emision: string;
  fecha_cita: string;
  nombre_cliente?: string;
  correo_cliente?: string;
  metodo_pago?: string;
  servicios_detalle?: Servicio[] | null;
  servicios?: Servicio[]; // Alternative field name that might be used
  costo_total?: number;   // Added to match the API response
}

const formatearFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString('es-MX');
};



export default function FacturasTab() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchFacturas = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/facturas');
      if (!response.ok) throw new Error('Error al cargar las facturas');
      const data = await response.json();
      setFacturas(data);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las facturas',
        className: 'bg-red-100 border-red-400 text-red-700',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchFacturas();
  }, [fetchFacturas]);

  // El procesamiento de servicios_detalle ahora se maneja directamente en el mapeo de la tabla

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta factura? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/facturas', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Error al eliminar la factura');

      toast({
        title: 'Éxito',
        description: 'Factura eliminada correctamente',
      });

      // Actualizar la lista de facturas
      fetchFacturas();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la factura',
        className: 'bg-red-100 border-red-400 text-red-700',
      });
    }
  };



  const filteredFacturas = facturas.filter((factura) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      factura.id_factura_pk?.toString().includes(searchTerm) ||
      factura.nombre_cliente?.toLowerCase().includes(searchLower) ||
      factura.metodo_pago?.toLowerCase().includes(searchLower) ||
      factura.correo_cliente?.toLowerCase().includes(searchLower)
    );
  });

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
        <h2 className="text-2xl font-bold">Historial de Facturas</h2>
        
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Buscar por número de factura, cliente o método de pago..."
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de facturas */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredFacturas.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No se encontraron facturas que coincidan con la búsqueda
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factura</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método de Pago</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFacturas.map((factura) => (
                  <tr key={factura.id_factura_pk} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full">
                          <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">#{factura.id_factura_pk}</div>
                          <div className="text-sm text-gray-500">Cita: {factura.id_cita_fk || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{factura.nombre_cliente || 'Sin nombre'}</div>
                      <div className="text-sm text-gray-500">{factura.correo_cliente || 'Sin correo'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <span className="font-medium">Emisión:</span> {factura.fecha_emision ? formatearFecha(factura.fecha_emision) : 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Cita:</span> {factura.fecha_cita ? formatearFecha(factura.fecha_cita) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full capitalize">
                          {factura.metodo_pago?.toLowerCase() || 'No especificado'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => factura.id_factura_pk && handleDelete(factura.id_factura_pk)}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar factura"
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
