"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Heart, Shield, Clock, Users } from "lucide-react"

// 🔧 AQUÍ PUEDES MODIFICAR EL CONTENIDO
const sectionData = {
  image: "/images/cumpleanos.jpg",
  badge: "¿Por qué elegirnos?",
  title: "Más que una guardería, somos familia",
  subtitle: "Tu tranquilidad es nuestra prioridad",
  description:
    "Con más de 5 años de experiencia cuidando a los mejores amigos de las familias, hemos creado un espacio donde cada perro recibe el amor y atención que merece.",
  features: [
    {
      icon: Shield,
      title: "Seguridad Garantizada",
      description: "Instalaciones 100% seguras con supervisión constante",
    },
    {
      icon: Heart,
      title: "Cuidado con Amor",
      description: "Personal capacitado que ama genuinamente a los animales",
    },
    {
      icon: Clock,
      title: "Horarios Flexibles",
      description: "Adaptamos nuestros servicios a tu rutina diaria",
    },
    {
      icon: Users,
      title: "Socialización Supervisada",
      description: "Grupos organizados para una interacción segura",
    },
  ],
  stats: [
    { number: "5", label: "Años de Experiencia" },
    { number: "24/7", label: "Supervisión" },
  ],
}

export default function DiagonalSection() {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    const element = document.getElementById("diagonal-section")
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [])

  return (
    <section id="diagonal-section" className="pt-6 lg:pt-10 pb-12 lg:pb-16 bg-gradient-to-b to-white w-full flex justify-center -mt-6">
      <div className="w-full max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 w-full">
            <div className="grid lg:grid-cols-2 min-h-[600px] w-full">
              {/* Lado izquierdo - Imagen */}
              <div className="relative overflow-hidden bg-gray-100">
                <div className="absolute inset-0 p-8 md:p-10 flex items-center justify-center">
                  <motion.div 
                    className="w-full h-full max-w-[90%] max-h-[90%] relative flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isVisible ? { 
                      opacity: 1, 
                      scale: 1,
                    } : {}}
                    transition={{ duration: 0.8 }}
                  >
                    <motion.div className="w-full h-full relative" style={{ perspective: '1000px' }}>
                      <motion.img
                        src={sectionData.image}
                        alt="Guardería canina"
                        className="w-full h-full object-cover rounded-2xl shadow-xl"
                        initial={{ rotate: -3 }}
                        whileHover={{
                          rotate: 0,
                          scale: 1.03,
                          transition: { 
                            duration: 0.5,
                            ease: [0.4, 0, 0.2, 1]
                          }
                        }}
                        style={{
                          transform: 'rotate(-3deg)',
                          transformOrigin: 'center',
                        }}
                      />
                      <motion.div 
                        className="absolute -top-4 -right-4 w-16 h-16 bg-green-800 rounded-full flex items-center justify-center text-white shadow-lg"
                        initial={{ scale: 0 }}
                        animate={isVisible ? { scale: 1 } : {}}
                        transition={{ delay: 0.3, type: 'spring' }}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                      >
                        <Heart className="w-8 h-8 fill-current" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>

              {/* Lado derecho - Contenido */}
              <div className="p-8 sm:p-10 lg:p-12 xl:p-16 flex flex-col justify-center w-full">
                {/* Badge */}
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <span className="inline-block bg-green-100 text-green-600 font-semibold px-4 py-2 rounded-full text-sm">
                    {sectionData.badge}
                  </span>
                </motion.div>

                {/* Título principal */}
                <motion.h3
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {sectionData.title}
                </motion.h3>

                {/* Subtítulo */}
                <motion.h4
                  className="text-lg md:text-xl text-green-500 font-semibold mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {sectionData.subtitle}
                </motion.h4>

                {/* Descripción */}
                <motion.p
                  className="text-gray-600 text-lg leading-relaxed mb-8 max-w-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  {sectionData.description}
                </motion.p>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {sectionData.features.map((feature, index) => {
                    const IconComponent = feature.icon
                    return (
                      <motion.div
                        key={index}
                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.6 + (index * 0.1) }}
                      >
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                          <IconComponent className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Estadísticas */}
                <div
                  className={`flex gap-8 justify-center transition-all duration-1000 delay-700 ${
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
                >
                  {sectionData.stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl lg:text-3xl font-bold text-blue-500">{stat.number}</div>
                      <div className="text-gray-600 text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos CSS para el clip diagonal optimizado */}
      <style jsx>{`
        .diagonal-clip {
          clip-path: polygon(0 0, 100% 0, 75% 100%, 0 100%);
          position: relative;
        }
        
        .diagonal-clip::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 3px;
          background: linear-gradient(to bottom, #f97316, #ea580c, #c2410c);
          transform: skew(-20deg);
          transform-origin: top right;
          box-shadow: 0 0 10px rgba(249, 115, 22, 0.3);
        }
        
        @media (max-width: 1023px) {
          .diagonal-clip {
            clip-path: none;
          }
          
          .diagonal-clip::after {
            display: none;
          }
        }
        
        @media (min-width: 1024px) {
          .diagonal-clip::before {
            content: '';
            position: absolute;
            top: 0;
            right: -1px;
            bottom: 0;
            width: 1px;
            background: rgba(255, 255, 255, 0.2);
            transform: skew(-20deg);
            transform-origin: top right;
            z-index: 1;
          }
        }
      `}</style>
    </section>
  )
}
