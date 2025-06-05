'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/logo';
import { Button } from "./ui/button"
import { X, Menu, LogIn, UserPlus } from "lucide-react"

const Navbar = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isActive = (path: string) => {
    return pathname === path;
  };

  // Renderizar solo en el cliente para evitar problemas de hidratación
  if (!isMounted) {
    return (
      <header className="bg-primary text-primary-foreground w-full shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex-shrink-0">
              <Logo className="flex items-center space-x-2" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-primary text-primary-foreground w-full shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="relative flex items-center justify-between w-full">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo className="flex items-center space-x-2" />
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
            <nav className="flex items-center">
              <div className="flex items-center space-x-6 lg:space-x-8">
                {[
                  { href: "/", label: "Inicio" },
                  { href: "/servicios", label: "Servicios" },
                  { href: "/galeria", label: "Galería" },
                  { href: "/contacto", label: "Contacto" }
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-1 py-2 text-center transition-colors group ${
                      isActive(item.href) ? 'text-green-800' : 'text-black hover:text-green-800'
                    }`}
                  >
                    {item.label}
                    <span 
                      className={`absolute bottom-0 left-0 w-full h-0.5 bg-green-800 transition-all duration-300 transform scale-x-0 ${
                        isActive(item.href) ? 'scale-x-100' : 'group-hover:scale-x-100'
                      }`}
                    />
                  </Link>
                ))}
              </div>
            </nav>
          </div>

          {/* Auth Buttons - Right Aligned */}
          <div className="hidden items-center space-x-3 md:flex ml-auto">
            <Link href="/login" passHref>
              <Button
                variant="outline"
                className="flex items-center space-x-1.5"
              >
                <LogIn className="h-4 w-4" />
                <span>Iniciar Sesión</span>
              </Button>
            </Link>
            <Link href="/registro" passHref>
              <Button
                variant="outline"
                className="flex items-center space-x-1.5"
              >
                <UserPlus className="h-4 w-4" />
                <span>Registrarse</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button - Solo en cliente */}
          <div className="md:hidden ml-4">
            <Button variant="outline" className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="menu-toggle-icon text-gray-400" /> : <Menu className="menu-toggle-icon text-gray-400" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-50">
            <nav className="flex flex-col p-4 space-y-4">
              <Link
                href="/"
                className={`px-4 py-2 rounded-md text-black hover:bg-green-800 ${isActive("/") ? "font-medium text-green-800" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                href="/servicios"
                className={`px-4 py-2 rounded-md text-black hover:bg-green-800 ${isActive("/servicios") ? "font-medium text-green-800" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Servicios
              </Link>
              <Link
                href="/galeria"
                className={`px-4 py-2 rounded-md text-black hover:bg-green-800 ${isActive("/galeria") ? "font-medium text-green-800" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Galería
              </Link>
              <Link
                href="/contacto"
                className={`px-4 py-2 rounded-md text-black hover:bg-green-800 ${isActive("/contacto") ? "font-medium text-green-800" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
                <Link href="/login" passHref>
                  <Button
                    variant="outline"
                    className="w-full justify-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/registro" passHref>
                  <Button
                    variant="secondary"
                    className="w-full justify-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Registrarse
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
