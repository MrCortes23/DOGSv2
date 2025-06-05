/* eslint-disable @next/next/no-img-element */
"use client"

import * as React from "react"
import { ArrowRight, ChevronLeft, ChevronRight, Phone, MapPin, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from 'next/navigation'

export interface SlideData {
  id: number;
  image: string;
  welcomeText: string;
  businessName: string;
  mainHeadline: string;
  description: string;
  primaryCTA: string;
  secondaryCTA: string;
  primaryUrl: string;
  secondaryUrl: string;
}

// 🔧 SLIDES POR DEFECTO - Se usan si no se proporcionan slides personalizados
const defaultSlides: SlideData[] = [
  {
    id: 1,
    image: "/images/navidad.jpg",
    welcomeText: "Bienvenidos a la",
    businessName: "Guardería Canina DOGS",
    mainHeadline: "El hogar perfecto para tu mejor amigo",
    description: "Cuidado profesional con amor y dedicación para que tu mascota se sienta como en casa.",
    primaryCTA: "Conocer Más", 
    secondaryCTA: "Contactar",
    primaryUrl: "/servicios",
    secondaryUrl: "/contacto",
  },
  {
    id: 2,
    image: "/images/pelotas.jpg",
    welcomeText: "Descubre",
    businessName: "Nuestros Servicios",
    mainHeadline: "Cuidado profesional para tu mascota",
    description: "Personal capacitado y instalaciones diseñadas especialmente para el bienestar de tu perro.",
    primaryCTA: "Ver Servicios",
    secondaryCTA: "Contactanos!",
    primaryUrl: "/servicios",
    secondaryUrl: "/contacto",
  },
  {
    id: 3,
    image: "/images/bigotes.jpg",
    welcomeText: "Únete a la",
    businessName: "Diversión Canina",
    mainHeadline: "Donde cada perro es especial",
    description: "Un ambiente seguro y divertido donde tu mascota hará nuevos amigos y vivirá experiencias únicas.",
    primaryCTA: "Agendar Visita",
    secondaryCTA: "Registrate!",
    primaryUrl: "/registro",
    secondaryUrl: "/contacto",
  },
]

interface SimpleHeroCarouselProps {
  slides?: SlideData[];
}

export default function SimpleHeroCarousel({ slides }: SimpleHeroCarouselProps) {
  const router = useRouter();
  const welcomeSlides = slides || defaultSlides;
  const [currentSlide, setCurrentSlide] = React.useState(0)
  
  // Función para manejar la navegación
  const handleNavigation = (url: string) => {
    router.push(url);
  };

  // Auto-play mejorado con pausa al hacer hover
  React.useEffect(() => {
    const carousel = document.getElementById('carousel-container');
    let interval: NodeJS.Timeout;
    
    const startInterval = () => {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % welcomeSlides.length);
      }, 10000); 
    };
    
    startInterval();
    
    const handleMouseEnter = () => clearInterval(interval);
    const handleMouseLeave = () => startInterval();
    
    carousel?.addEventListener('mouseenter', handleMouseEnter);
    carousel?.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      clearInterval(interval);
      carousel?.removeEventListener('mouseenter', handleMouseEnter);
      carousel?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [welcomeSlides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % welcomeSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + welcomeSlides.length) % welcomeSlides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const currentSlideData = welcomeSlides[currentSlide]

  return (
    <div className="relative w-full my-12 flex items-center justify-center overflow-x-hidden">
      <div 
        id="carousel-container"
        className="relative rounded-3xl overflow-hidden h-[75vh] min-h-[550px] max-h-[800px] shadow-2xl hover:shadow-3xl transition-all duration-500 w-full max-w-[1400px] mx-4 sm:mx-6 lg:mx-8 bg-gray-100 group"
      >
      {/* Contenedor de la imagen con animación */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1.05 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          <img
            src={currentSlideData.image || "/placeholder.svg"}
            alt={currentSlideData.businessName}
            className="w-full h-full object-cover object-center"
            style={{
              willChange: 'transform',
              filter: 'brightness(0.9)'
            }}
            loading="eager"
            decoding="async"
          />
          {/* Overlays mejorados */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent lg:from-black/40 lg:via-black/10 lg:to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Botones de navegación */}
      <div className="absolute inset-0 z-20 flex items-center justify-between pointer-events-none">
        <button
          onClick={prevSlide}
          className="p-2 ml-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100 pointer-events-auto"
          aria-label="Anterior"
          style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 30
          }}
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>
        <button
          onClick={nextSlide}
          className="p-2 mr-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100 pointer-events-auto"
          aria-label="Siguiente"
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 30
          }}
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Columna de contenido */}
            <motion.div 
              className="max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Texto de bienvenida */}
              <div className="mb-4 lg:mb-6">
                <motion.p 
                  className="text-white text-base md:text-lg lg:text-xl font-medium mb-1.5 md:mb-2.5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {currentSlideData.welcomeText}
                </motion.p>
                <motion.h1 
                  className="text-white text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 lg:mb-5 leading-tight tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {currentSlideData.businessName}
                </motion.h1>
              </div>

              {/* Headline principal */}
              <motion.h2 
                className="text-white text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 lg:mb-5 leading-tight"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {currentSlideData.mainHeadline}
              </motion.h2>

              {/* Descripción */}
              <motion.p 
                className="text-gray-100 text-sm md:text-base lg:text-lg mb-5 lg:mb-6 leading-relaxed max-w-2xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {currentSlideData.description}
              </motion.p>

              {/* Botones CTA */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-2.5 lg:gap-3.5 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <motion.button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigation(currentSlideData.primaryUrl);
                  }}
                  className="bg-green-800 hover:bg-green-600 text-white font-bold px-5 lg:px-7 py-2.5 lg:py-3.5 text-sm lg:text-base rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {currentSlideData.primaryCTA}
                  <ArrowRight className="ml-1.5 w-3.5 h-3.5 lg:w-4 lg:h-4" />
                </motion.button>
                <motion.button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigation(currentSlideData.secondaryUrl);
                  }}
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-5 lg:px-7 py-2.5 lg:py-3.5 text-sm lg:text-base rounded-full transition-all duration-300 backdrop-blur-sm whitespace-nowrap"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 1)', color: '#111827' }}
                  whileTap={{ scale: 0.98 }}
                >
                  {currentSlideData.secondaryCTA}
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Columna vacía para dar espacio a la imagen */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </div>

      {/* Información de contacto */}
      <div className="absolute top-6 right-6 bg-white/15 backdrop-blur-md rounded-xl p-3 lg:p-4 text-white border border-white/20 hidden md:block">
        <div className="flex flex-col gap-2 text-xs lg:text-sm">
          <div className="flex items-center gap-2">
            <Phone className="w-3 h-3 lg:w-4 lg:h-4 text-black" />
              <span>(301) 8268642</span>
            </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3 lg:w-4 lg:h-4 text-black" />
            <span>Calle 27 #5-142</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 lg:w-4 lg:h-4 text-black" />
            <span>7AM - 6PM</span>
          </div>
        </div>
      </div>

      </div>

      {/* Controles de navegación */}
      <button
        onClick={prevSlide}
        className="absolute -left-6 lg:-left-8 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/25 text-white border border-white/30 hover:border-white/50 backdrop-blur-sm w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all duration-300 z-20"
      >
        <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute -right-6 lg:-right-8 top-1/2 -translate-y-1/2 bg-white/15 hover:bg-white/25 text-white border border-white/30 hover:border-white/50 backdrop-blur-sm w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all duration-300 z-20"
      >
        <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
      </button>

      {/* Indicadores de progreso */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {welcomeSlides.map((_, index) => {
          const isActive = index === currentSlide;
          return (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="relative p-2 group"
              aria-label={`Ir al slide ${index + 1}`}
            >
              <div className="w-3 h-3 rounded-full bg-white/30 group-hover:bg-white/50 transition-colors duration-200 relative">
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-white rounded-full"
                    layoutId="activeIndicator"
                    transition={{
                      duration: 0.3,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                  />
                )}
              </div>
              <span className="sr-only">Slide {index + 1}</span>
            </button>
          );
        })}
      </div>

      {/* Información adicional en móvil */}
      <div className="absolute bottom-16 left-6 right-6 md:hidden">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 text-white border border-white/20">
          <div className="flex justify-between text-xs">
            <span>📞 (311) 5632613</span>
            <span>📍 Calle 11#10b-22</span>
            <span>🕐 7AM - 6PM</span>
          </div>
        </div>
      </div>

      {/* Estilos de animación */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-fade-in-delay { animation: fade-in 0.8s ease-out 0.2s both; }
        .animate-slide-up { animation: slide-up 0.8s ease-out; }
        .animate-slide-up-delay { animation: slide-up 0.8s ease-out 0.1s both; }
        .animate-slide-up-delay-2 { animation: slide-up 0.8s ease-out 0.3s both; }
      `}</style>
    </div>
  )
}
