'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { getUserDataFromCookie } from '@/lib/auth';
import LogoutButton from '@/components/dashboard/logout-button';

// Importaciones dinámicas para mejor rendimiento
const ClientesTab = dynamic(() => import('@/components/admin/ClientesTab'), { ssr: false });
const CitasTab = dynamic(() => import('@/components/admin/CitasTab'), { ssr: false });
const PerrosTab = dynamic(() => import('@/components/admin/PerrosTab'), { ssr: false });
const FacturasTab = dynamic(() => import('@/components/admin/FacturasTab'), { ssr: false });

interface UserData {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  rol: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('clientes');
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Verificar autenticación y rol
    const checkAuth = () => {
      try {
        const user = getUserDataFromCookie();
        console.log('Datos del usuario desde cookie:', user);
        
        if (!user) {
          console.log('No hay usuario autenticado, redirigiendo a login');
          router.push('/login');
          return;
        }

        setUserData(user);
        
        // Verificar si el usuario es administrador
        if (user.rol === 'administrador' || user.rol === 'admin') {
          console.log('Usuario es administrador');
          setIsAdmin(true);
          setIsLoading(false);
        } else {
          console.log('Usuario no es administrador, redirigiendo a dashboard');
          router.push('/dashboard');
          return;
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Acceso no autorizado. Redirigiendo...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {userData?.correo}
          </span>
          <LogoutButton />
        </div>
      </div>

      <Tabs>
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger 
            onClick={() => setActiveTab('clientes')}
            data-state={activeTab === 'clientes' ? 'active' : 'inactive'}
          >
            Clientes
          </TabsTrigger>
          <TabsTrigger 
            onClick={() => setActiveTab('mascotas')}
            data-state={activeTab === 'mascotas' ? 'active' : 'inactive'}
          >
            Mascotas
          </TabsTrigger>
          <TabsTrigger 
            onClick={() => setActiveTab('citas')}
            data-state={activeTab === 'citas' ? 'active' : 'inactive'}
          >
            Citas
          </TabsTrigger>
          <TabsTrigger 
            onClick={() => setActiveTab('facturas')}
            data-state={activeTab === 'facturas' ? 'active' : 'inactive'}
          >
            Facturas
          </TabsTrigger>
        </TabsList>
        <div className="mt-6">
          {activeTab === 'clientes' && <ClientesTab />}
          {activeTab === 'mascotas' && <PerrosTab />}
          {activeTab === 'citas' && <CitasTab />}
          {activeTab === 'facturas' && <FacturasTab />}
        </div>
      </Tabs>
    </div>
  );
}
