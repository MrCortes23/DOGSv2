'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, Plus } from 'lucide-react';

interface Raza {
  id_raza_pk: number;
  tipo_de_raza: string;
  tamano?: string;
  caracteristicas?: string;
}

export default function RazasTab() {
  const [razas, setRazas] = useState<Raza[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<Raza, 'id_raza_pk'>>({ 
    tipo_de_raza: '',
    tamano: '',
    caracteristicas: ''
  });
  const { toast } = useToast();

  const fetchRazas = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/razas');
      if (!response.ok) throw new Error('Error al cargar las razas');
      const data = await response.json();
      setRazas(data);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las razas',
        className: 'bg-red-100 border-red-400 text-red-700',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchRazas();
  }, [fetchRazas]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tipo_de_raza.trim()) return;
    
    try {
      const response = await fetch('/api/admin/razas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo_de_raza: formData.tipo_de_raza.trim(),
          tamano: formData.tamano?.trim() || null,
          caracteristicas: formData.caracteristicas?.trim() || null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar la raza');
      }

      const newRaza = await response.json();
      setRazas(prev => [newRaza, ...prev]);
      handleDialogClose();
      
      toast({
        title: '¡Éxito!',
        description: 'Raza guardada correctamente',
        className: 'bg-green-100 border-green-400 text-green-700',
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al guardar la raza',
        className: 'bg-red-100 border-red-400 text-red-700',
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta raza?')) return;
    
    setIsDeleting(id);
    
    try {
      const response = await fetch('/api/admin/razas', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar la raza');
      }

      setRazas(prev => prev.filter(raza => raza.id_raza_pk !== id));
      
      toast({
        title: '¡Éxito!',
        description: 'Raza eliminada correctamente',
        className: 'bg-green-100 border-green-400 text-green-700',
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al eliminar la raza',
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

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setFormData({ tipo_de_raza: '', tamano: '', caracteristicas: '' });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Razas</h2>
        <button 
          type="button"
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar Raza
        </button>
      </div>

      {isDialogOpen && (
        <div 
          className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && handleDialogClose()}
        >
          <div className="bg-white p-6 rounded-lg w-full max-w-md border-1 border-black shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Agregar Nueva Raza</h3>
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
                <label htmlFor="tipo_de_raza" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Raza *
                </label>
                <input
                  id="tipo_de_raza"
                  name="tipo_de_raza"
                  type="text"
                  value={formData.tipo_de_raza}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="tamano" className="block text-sm font-medium text-gray-700 mb-1">
                  Tamaño
                </label>
                <input
                  id="tamano"
                  name="tamano"
                  type="text"
                  value={formData.tamano || ''}
                  onChange={handleInputChange}
                  placeholder="Ej: Pequeño, Mediano, Grande"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="caracteristicas" className="block text-sm font-medium text-gray-700 mb-1">
                  Características
                </label>
                <textarea
                  id="caracteristicas"
                  name="caracteristicas"
                  value={formData.caracteristicas || ''}
                  onChange={handleInputChange}
                  placeholder="Descripción de la raza"
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                  disabled={!formData.tipo_de_raza.trim()}
                >
                  Guardar
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Raza</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tamaño</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Características</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {razas.length > 0 ? (
                razas.map((raza) => (
                  <tr key={raza.id_raza_pk} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{raza.id_raza_pk}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{raza.tipo_de_raza}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{raza.tamano || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{raza.caracteristicas || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(raza.id_raza_pk)}
                        disabled={isDeleting === raza.id_raza_pk}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {isDeleting === raza.id_raza_pk ? (
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
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No hay razas registradas
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
