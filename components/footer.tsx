import Link from "next/link"
import Image from "next/image"
import {Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black text-white py-12 w-full">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 w-full">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Image 
                src="/images/logopagina.png" 
                alt="Logo"  
                width={40} 
                height={40}
                className="h-15 w-35"
                priority
              />
            </div>
            <p className="text-white/80 mb-4">
              El mejor cuidado para tu mejor amigo. Ofrecemos servicios de guardería, peluquería y entrenamiento para
              perros.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-secondary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-secondary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-secondary transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div className="px-2">
            <h3 className="text-xl font-bold mb-5">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white/80 hover:text-secondary transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="text-white/80 hover:text-secondary transition-colors">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/galeria" className="text-white/80 hover:text-secondary transition-colors">
                  Galería
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-white/80 hover:text-secondary transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-white/80 hover:text-secondary transition-colors">
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link href="/registro" className="text-white/80 hover:text-secondary transition-colors">
                  Registrarse
                </Link>
              </li>
            </ul>
          </div>

          <div className="px-2">
            <h3 className="text-xl font-bold mb-5">Servicios</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/servicios#guarderia" className="text-white/80 hover:text-secondary transition-colors">
                  Guardería Canina
                </Link>
              </li>
              <li>
                <Link href="/servicios#peluqueria" className="text-white/80 hover:text-secondary transition-colors">
                  Peluquería
                </Link>
              </li>
              <li>
                <Link href="/servicios#entrenamiento" className="text-white/80 hover:text-secondary transition-colors">
                  Entrenamiento
                </Link>
              </li>
              <li>
                <Link href="/servicios#paseos" className="text-white/80 hover:text-secondary transition-colors">
                  Paseos
                </Link>
              </li>
              <li>
                <Link href="/servicios#hospedaje" className="text-white/80 hover:text-secondary transition-colors">
                  Hospedaje
                </Link>
              </li>
            </ul>
          </div>

          <div className="px-2">
            <h3 className="text-xl font-bold mb-5 text-center lg:text-left">Contáctanos</h3>
            <ul className="space-y-5">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-secondary mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-white/80 text-left">
                  Calle Principal 123
                  <br />
                  Ciudad, CP 12345
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-secondary mr-3 flex-shrink-0" />
                <span className="text-white/80">(123) 456-7890</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-secondary mr-3 mt-1 flex-shrink-0" />
                <span className="text-white/80 break-all">info@dogs.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-white/60">&copy; {new Date().getFullYear()} DOGS. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
