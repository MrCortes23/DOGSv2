"use client"

import * as React from "react"
import { Heart, Users, Clock, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

// 🔧 AQUÍ PUEDES MODIFICAR LOS SERVICIOS PRINCIPALES
const mainServices = [
  {
    id: 1,
    title: "Galeria",
    subtitle: "Conoce algunos miembros de la guarderia!",
    description:
      "Conoce la lista de caninos que se encuentran registrados en la Guarderia Canina DOGS.",
    image: "/images/amigos.jpg",
    icon: Heart,
    features: ["Supervisión 24/7", "Alimentación incluida", "Reportes diarios"],
    price: "Amigos",
    ctaText: "Visualizar Galeria",
    url: "/galeria", // Ruta para este servicio
  },
  {
    id: 2,
    title: "Servicios",
    subtitle: "Servicios de la Guarderia DOGS",
    description:
      "Conoce los diferentes servicios que se ofrecen en la Guarderia Canina DOGS.",
    image: "/images/correa.jpg",
    icon: Users,
    features: ["Baño", "Peluqueria", "Hospedaje"],
    price: "Comodidad",
    ctaText: "Conoce más",
    url: "/servicios", // Ruta para este servicio
  },
  {
    id: 3,
    title: "Agenda tu cita",
    subtitle: "Citas para tu Canino",
    description:
      "Conoce los dias y horarios disponibles para tu canino.",
    image: "/images/selfie2.jpg",
    icon: Clock,
    features: ["Dias y horarios disponibles", "Costo por hora", "Metodos de pago"],
    price: "Diversión",
    ctaText: "Agenda tu cita",
    url: "/citas", // Ruta para este servicio
  },
]

export default function MainServices() {
  const [hoveredCard, setHoveredCard] = React.useState<number | null>(null)
  
  // Función para manejar la navegación
  const handleNavigation = (url: string) => {
    if (url) {
      window.location.href = url;
    }
  };

  // Configuración de animación
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  }

  // Configuración de animación para el título
  const titleVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  }

  return (
    <motion.section 
      className="pt-10 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-gray-50 to-white w-full flex justify-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px 0px -50px 0px" }}
      variants={containerVariants}
    >
      <div className="w-[90%] max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12 lg:mb-16"
          variants={titleVariants}
        >
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            Conoce la Guardería
            <span className="text-green-800"> DOGS</span>
          </motion.h2>
          <motion.p 
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { delay: 0.2 }
              }
            }}
          >
            Descubre los servicios diseñados especialmente para el bienestar, felicidad y seguridad de tu mejor amigo
          </motion.p>
        </motion.div>

        {/* Tarjetas de servicios */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {mainServices.map((service) => {
            const IconComponent = service.icon
            const isHovered = hoveredCard === service.id

            return (
              <motion.div
                key={service.id}
                className={`group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                  isHovered ? "scale-[1.03]" : ""
                }`}
                onMouseEnter={() => setHoveredCard(service.id)}
                onMouseLeave={() => setHoveredCard(null)}
                variants={itemVariants}
                viewport={{ once: true }}
                initial="hidden"
                whileInView="visible"
              >
                {/* Contenido de la tarjeta */}
                <div className="p-6 lg:p-8 text-center">
                  {/* Imagen circular */}
                  <div className="relative mb-6 flex justify-center">
                    <div className="relative">
                      <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-gray-100 shadow-xl group-hover:border-gray-300 transition-all duration-500">
                        <Image
                          src={service.image || "/placeholder.svg"}
                          alt={service.title}
                          width={160}
                          height={160}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          priority
                        />
                      </div>

                      {/* Icono flotante */}
                      <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-3 shadow-lg group-hover:bg-blue-600 transition-colors duration-300">
                        <IconComponent className="w-5 h-5" />
                      </div>

                      {/* Precio flotante */}
                      <div className="absolute -top-2 -right-2 bg-white text-blue-600 font-bold px-3 py-1 rounded-full text-sm shadow-lg border-2 border-blue-200">
                        {service.price}
                      </div>
                    </div>
                  </div>

                  {/* Título y subtítulo */}
                  <div className="mb-4">
                    <h3 className="text-xl lg:text-2xl font-bold text-black mb-2 group-hover:text-gray-600 transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-gray-800 font-medium text-sm">{service.subtitle}</p>
                  </div>

                  {/* Descripción */}
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>

                  {/* Features */}
                  <div className="mb-6">
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center justify-center gap-2 text-sm text-gray-700">
                          <div className="w-2 h-2 bg-gray-500 rounded-full flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <button 
                    type="button"
                    onClick={() => handleNavigation(service.url)}
                    className="w-full bg-gradient-to-r from-green-800 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    {service.ctaText}
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>

                {/* Efecto de brillo en hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:animate-shimmer rounded-2xl" />
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Estilos de animación */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s ease-in-out;
        }
      `}</style>
    </motion.section>
  )
}
