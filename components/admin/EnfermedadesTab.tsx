'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, Plus } from 'lucide-react';

interface Enfermedad {
  id_enfermedad_pk: number;
  tipo_de_enfermedad: string;
  observaciones?: string;
}

export default function EnfermedadesTab() {
  const [enfermedades, setEnfermedades] = useState<Enfermedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<Enfermedad, 'id_enfermedad_pk'>>({ 
    tipo_de_enfermedad: '',
    observaciones: ''
  });
  const { toast } = useToast();

  const fetchEnfermedades = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/enfermedades');
      if (!response.ok) throw new Error('Error al cargar las enfermedades');
      const data = await response.json();
      setEnfermedades(data);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las enfermedades',
        className: 'bg-red-100 border-red-400 text-red-700',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchEnfermedades();
  }, [fetchEnfermedades]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false);
    setFormData({ tipo_de_enfermedad: '', observaciones: '' });
    setIsSubmitting(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevenir la propagación del evento
    
    if (isSubmitting || !formData.tipo_de_enfermedad.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/admin/enfermedades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo_de_enfermedad: formData.tipo_de_enfermedad.trim(),
          observaciones: formData.observaciones?.trim() || null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar la enfermedad');
      }

      const newEnfermedad = await response.json();
      setEnfermedades(prev => [newEnfermedad, ...prev]);
      
      // Limpiar el formulario
      setFormData({ tipo_de_enfermedad: '', observaciones: '' });
      
      // Cerrar el diálogo después de un pequeño retraso
      setTimeout(() => {
        setIsDialogOpen(false);
        setIsSubmitting(false);
      }, 100);
      
      toast({
        title: '¡Éxito!',
        description: 'Enfermedad guardada correctamente',
        className: 'bg-green-100 border-green-400 text-green-700',
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al guardar la enfermedad',
        className: 'bg-red-100 border-red-400 text-red-700',
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta enfermedad?')) return;
    
    setIsDeleting(id);
    
    try {
      const response = await fetch('/api/admin/enfermedades', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar la enfermedad');
      }

      setEnfermedades(prev => prev.filter(enfermedad => enfermedad.id_enfermedad_pk !== id));
      
      toast({
        title: '¡Éxito!',
        description: 'Enfermedad eliminada correctamente',
        className: 'bg-green-100 border-green-400 text-green-700',
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al eliminar la enfermedad',
        className: 'bg-red-100 border-red-400 text-red-700',
      });
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Enfermedades</h2>
        <button 
          type="button"
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar Enfermedad
        </button>
      </div>

      {isDialogOpen && (
        <div 
          className="fixed inset-0 bg-white bg-opacity-50  flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && handleDialogClose()}
        >
          <div className="bg-white p-6 rounded-lg w-full max-w-md border-1 border-black shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Agregar Nueva Enfermedad</h3>
              <button 
                type="button"
                onClick={handleDialogClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="tipo_de_enfermedad" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Enfermedad *
                </label>
                <input
                  id="tipo_de_enfermedad"
                  name="tipo_de_enfermedad"
                  type="text"
                  value={formData.tipo_de_enfermedad}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones
                </label>
                <textarea
                  id="observaciones"
                  name="observaciones"
                  value={formData.observaciones || ''}
                  onChange={handleInputChange}
                  placeholder="Descripción o notas adicionales"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleDialogClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center min-w-[100px]"
                  disabled={!formData.tipo_de_enfermedad.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Guardando...
                    </>
                  ) : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Enfermedad</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observaciones</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enfermedades.length > 0 ? (
                enfermedades.map((enfermedad) => (
                  <tr key={enfermedad.id_enfermedad_pk} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{enfermedad.id_enfermedad_pk}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{enfermedad.tipo_de_enfermedad}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{enfermedad.observaciones || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(enfermedad.id_enfermedad_pk)}
                        disabled={isDeleting === enfermedad.id_enfermedad_pk}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {isDeleting === enfermedad.id_enfermedad_pk ? (
                          <span className="inline-block h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          <Trash2 className="h-5 w-5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No hay enfermedades registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
