"use client"

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from './logout-button';
import Logo from '@/components/logo';
import { Menu, X } from 'lucide-react';

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  // Cerrar el sidebar cuando cambia la ruta
  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false);
    };
    handleRouteChange();
  }, [pathname]);

  // No mostrar el sidebar en la ruta de administración
  if (pathname.startsWith('/admin')) {
    return null;
  }
  
  const isActive = (path: string) => {
    return pathname === path;
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Renderizar el botón de menú para móviles
  const MobileMenuButton = () => (
    <button 
      onClick={toggleSidebar}
      className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md md:hidden"
      aria-label="Menú"
    >
      <Menu className="w-6 h-6 text-gray-700" />
    </button>
  );

  return (
    <>
      {/* Botón de menú para móviles */}
      <MobileMenuButton />
      
      {/* Contenedor del overlay y sidebar */}
      <div>
        {/* Overlay */}
        <div 
          className={`fixed inset-0 bg-white bg-opacity-50 z-40 transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          } md:hidden`}
          onClick={toggleSidebar}
        />
        
        {/* Sidebar */}
        <div 
          className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <Logo />
                <button 
                  onClick={toggleSidebar} 
                  className="md:hidden p-1 text-gray-500 hover:text-gray-700"
                  aria-label="Cerrar menú"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <nav className="flex-1 overflow-y-auto p-2">
              <ul className="space-y-1">
                {[
                  { href: '/dashboard', icon: '📊', label: 'Resumen' },
                  { href: '/dashboard/perros', icon: '🐶', label: 'Perros' },
                  { href: '/dashboard/citas', icon: '📅', label: 'Citas' },
                  { href: '/dashboard/facturacion', icon: '💰', label: 'Facturación' },
                  { href: '/dashboard/configuracion', icon: '⚙️', label: 'Configuración' },
                ].map((item) => (
                  <li key={item.href}>
                    <Link 
                      href={item.href} 
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                        isActive(item.href) 
                          ? 'bg-indigo-50 text-indigo-600' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
                
                <li className="mt-4 pt-4 border-t border-gray-100">
                  <LogoutButton />
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;