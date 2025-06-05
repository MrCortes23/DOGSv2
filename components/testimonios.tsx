"use client"

import * as React from "react"
import { Quote, Heart } from "lucide-react"
import Image from "next/image"
import { motion, Variants } from "framer-motion"

interface Testimonial {
  id: number;
  name: string;
  petName: string;
  petBreed: string;
  image: string;
  petImage: string;
  testimonial: string;
  service: string;
  timeAsClient: string;
}

// 🔧 AQUÍ PUEDES MODIFICAR LOS TESTIMONIOS
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "María González",
    petName: "Luna",
    petBreed: "Golden Retriever",
    image: "/images/cliente1.jpg",
    petImage: "/images/insana1.jpg",
    testimonial:
      "Increíble servicio! Luna siempre regresa feliz y relajada. El personal es muy profesional y se nota que realmente aman a los animales. No podría estar más satisfecha.",
    service: "Guarderia",
    timeAsClient: "2 años",
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    petName: "Max",
    petBreed: "Pastor Alemán",
    image: "/images/cliente2.jpg",
    petImage: "/images/insana2.jpg",
    testimonial:
      "Max era muy tímido con otros perros, pero gracias al Hospedaje ahora es súper sociable. El cambio ha sido increíble y estoy muy agradecido.",
    service: "Paseos",
    timeAsClient: "1 año",
  },
  {
    id: 3,
    name: "Ana Martínez",
    petName: "Coco",
    petBreed: "French Bulldog",
    image: "/images/cliente3.jpg",
    petImage: "/images/insan3.jpg",
    testimonial:
      "Cuando viajo por trabajo, sé que Coco está en las mejores manos. Las instalaciones son impecables y el cuidado nocturno es excepcional. Totalmente recomendado.",
    service: "Hospedaje",
    timeAsClient: "6 meses",
  },
]

// Animaciones
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { 
    opacity: 0,
    rotateX: 15,
    y: 50,
    scale: 0.95
  },
  visible: (i: number) => ({
    opacity: 1,
    rotateX: 0,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100,
      delay: i * 0.15,
      duration: 0.8
    }
  }),
  hover: {
    y: -10,
    scale: 1.02,
    boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 15
    }
  }
}

const cardVariants = {
  initial: {
    rotateY: 0,
    transition: { duration: 0.5 }
  },
  hover: {
    rotateY: 5,
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 15
    }
  }
}

export default function Testimonials() {

  return (
    <motion.section 
      className="pt-12 pb-16 lg:pt-20 lg:pb-24 w-full flex justify-center relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px 0px -50px 0px" }}
    >
      {/* Efecto de fondo sutil */}
      <div className="absolute inset-0 bg-[rad-gradient(ellipse_at_center,hsla(24,100%,50%,0.03)_0%,hsla(0,0%,100%,0)_70%)]" />
      <div className="w-[90%] max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Lo Que Dicen Nuestros
            <span className="text-green-800"> Clientes</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Historias reales de familias felices que confían en nosotros para el cuidado de sus mejores amigos
          </p>
        </motion.div>

        {/* Testimonios en grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
        >
          {testimonials.map((testimonial, index) => {
            return (
              <motion.div
                key={testimonial.id}
                className="group relative"
                variants={itemVariants}
                custom={index}
                whileHover="hover"
                viewport={{ once: true, margin: '0px 0px -100px 0px' }}
              >
                <motion.div
                  className="relative bg-white rounded-2xl overflow-hidden shadow-lg h-full flex flex-col"
                  initial="initial"
                  whileHover="hover"
                  variants={cardVariants}
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                >
                {/* Icono de comillas */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-blue-500 text-white rounded-full p-2">
                    <Quote className="w-4 h-4" />
                  </div>
                </div>

                {/* Contenido de la tarjeta */}
                <div className="p-6 lg:p-8">
                  {/* Imágenes circulares - Cliente y mascota */}
                  <div className="flex justify-center items-center gap-4 mb-6">
                    {/* Imagen del cliente */}
                    <div className="relative">
                      <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden border-3 border-orange-200 shadow-lg">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                          priority
                        />
                      </div>
                    </div>

                    {/* Corazón central */}
                    <div className="bg-green-500 text-white rounded-full p-2">
                      <Heart className="w-4 h-4 fill-current" />
                    </div>

                    {/* Imagen de la mascota */}
                    <div className="relative">
                      <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden border-3 border-orange-200 shadow-lg">
                        <Image
                          src={testimonial.petImage}
                          alt={testimonial.petName}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                          priority
                        />
                      </div>
                    </div>
                  </div>

                  {/* Información del cliente */}
                  <div className="text-center mb-4">
                    <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-1">{testimonial.name}</h3>
                    <p className="text-green-800 font-medium text-sm">
                      Dueña de {testimonial.petName} • {testimonial.petBreed}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">Cliente por {testimonial.timeAsClient}</p>
                  </div>

                  {/* Testimonial */}
                  <blockquote className="text-gray-600 text-center leading-relaxed mb-4 italic">
                    &ldquo;{testimonial.testimonial}&rdquo;
                  </blockquote>

                  {/* Servicio utilizado */}
                  <div className="text-center">
                    <span className="bg-blue-100 text-blue-600 font-medium px-3 py-1 rounded-full text-sm">
                      Servicio: {testimonial.service}
                    </span>
                  </div>
                </div>

                  {/* Efecto de brillo en hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:animate-shimmer rounded-2xl" />
                  
                  {/* Efecto de luz en la esquina */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Estilos de animación */}
      <style jsx>{`
        @keyframes shimmer {
          0% { 
            transform: translateX(-100%) rotate(-12deg);
            opacity: 0.7;
          }
          100% { 
            transform: translateX(100%) rotate(-12deg);
            opacity: 0;
          }
        }
        .group-hover\:animate-shimmer {
          animation: shimmer 1.8s infinite;
          animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Mejoras 3D */
        .group {
          transform-style: preserve-3d;
          perspective: 1200px;
        }
        
        /* Suavizar el renderizado 3D */
        * {
          transform: translate3d(0, 0, 0);
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
      `}</style>
    </motion.section>
  )
}
