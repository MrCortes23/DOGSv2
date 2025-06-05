/* eslint-disable @next/next/no-img-element */
'use client';

"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, Scissors, Gamepad2, Gamepad, Camera, Stethoscope } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Service {
  id: number;
  title: string;
  description: string;
  features: string[];
  image: string;
  icon: React.ReactNode;
  price: string;
  slug: string;
}

const services: Service[] = [
  {
    id: 1,
    title: 'Baño y Peluquería',
    description: 'Servicio completo de baño y peluquería para tu mascota.',
    features: ['Limpieza de orejas', 'Limpieza de patas', 'Limpieza de boca', 'Antipulgas'],
    image: '/images/baño.jpg',
    icon: <Scissors className="w-6 h-6" />,
    price: 'Desde $45.000',
    slug: 'registro',
  },
  {
    id: 2,
    title: 'Consulta Veterinaria',
    description: 'Consulta veterinaria para tu mascota, con un veterinario especializado.',
    features: ['Veterinario Certificado', 'Valoración general', 'Consulta de medicamentos', 'Vacunas y desparasitación'],
    image: '/images/veterinaria.jpg',
    icon: <Stethoscope className="w-6 h-6" />,
    price: 'Desde $70.000/sesión',
    slug: 'consulta-veterinaria',
  },
  {
    id: 3,
    title: 'Entrenamiento Avanzado',
    description: 'Entrenamiento avanzado para perros para que desarrollen habilidades especiales.',
    features: ['Clases personalizadas', 'Entrenamiento de seguridad', 'Entrenamiento de comandos', 'Entrenamiento de comportamiento'],
    image: '/images/entrenamiento.jpg',
    icon: <Shield className="w-6 h-6" />,
    price: 'Desde $60.000/clase',
    slug: 'entrenamiento-avanzado',
  },
  {
    id: 4,
    title: 'Entrenamiento basico',
    description: 'Actividades lúdicas y de entretenimiento diseñadas para mantener a tu perro activo y feliz.',
    features: ['Juegos interactivos', 'Área de juegos', 'Actividades grupales', 'Estimulación mental'],
    image: '/images/corriendo.jpg',
    icon: <Gamepad2 className="w-6 h-6" />,
    price: 'Desde $40.000/sesion',
    slug: 'entrenamiento-basico',
  },
  {
    id: 5,
    title: 'Guardería por día',
    description: 'Servicio de cuidado dentro de nuestro establecimiento por un dia.',
    features: ['Comida', 'Juguetes', 'Diversión', 'Recogelo a la hora que quieras!'],
    image: '/images/guarderia.jpg',
    icon: <Gamepad className="w-6 h-6" />,
    price: 'Desde $25.000/dia',
    slug: 'guarderia-dia',
  },
  {
    id: 6,
    title: 'Guardería por semana',
    description: 'Servicio de cuidado dentro de nuestro establecimiento por una semana.',
    features: ['Comidas del día', 'Juguetes', 'Recreación', 'Lugar para descansar'],
    image: '/images/guarderia2.jpg',
    icon: <Heart className="w-6 h-6" />,
    price: 'Desde $150.000/semana',
    slug: 'guarderia-semana',
  },
  {
    id: 7,
    title: 'Paseo',
    description: 'Servicio de paseos para tu perro.',
    features: ['Paseos a diferentes zonas', 'Responsables de tu mascota', 'Diversión', 'Supervisión constante'],
    image: '/images/paseito.jpeg',
    icon: <Camera className="w-6 h-6" />,
    price: 'Desde $35.000',
    slug: 'paseo',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      when: 'beforeChildren',
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      duration: 0.5,
    },
  },
  hover: {
    scale: 1.02,
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: 0.2,
    },
  },
  tap: {
    scale: 0.98,
  },
};

const ServicesSection = () => {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleMoreInfo = () => {
    router.push('/registro');
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white w-full">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-16 w-full">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-black to-green-500">Nuestros Servicios</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ofrecemos una amplia gama de servicios profesionales para el cuidado y bienestar de tu mascota en la Guarderia Canina DOGS
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={isVisible ? 'show' : 'hidden'}
          className="space-y-10"
        >
          {services.map((service, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={service.id}
                variants={item}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-100px' }}
                whileHover="hover"
                whileTap="tap"
                onHoverStart={() => setHoveredCard(service.id)}
                onHoverEnd={() => setHoveredCard(null)}
                className={`relative overflow-hidden rounded-2xl shadow-lg ${
                  hoveredCard && hoveredCard !== service.id ? 'opacity-70' : 'opacity-100'
                } transition-all duration-300`}
              >
                <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} min-h-[200px]`}>
                  {/* Image Section */}
                  <div className="lg:w-1/2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-600/20 to-white/20 z-10"></div>
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                      <div className="flex items-center space-x-2">
                        <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full">
                          {service.icon}
                        </div>
                        <span className="text-white font-bold text-lg bg-black/50 px-3 py-1 rounded-full">
                          {service.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="lg:w-1/2 p-6 bg-white">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-center">
                          <svg
                            className="w-4 h-4 text-green-500 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleMoreInfo}
                      className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-medium hover:opacity-90 transition-all duration-300 transform hover:scale-105"
                      type="button"
                    >
                      Más información
                    </button>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-300 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200 to-transparent rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-gray-600 to-green-800 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">¿Listo para darle a tu mascota el mejor cuidado?</h3>
            <p className="text-blue-100 mb-6 text-lg">
              Contáctanos hoy y descubre por qué somos la guardería canina de confianza
            </p>
            <button 
              onClick={() => router.push('/contacto')}
              className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition-colors duration-300 transform hover:scale-105"
            >
              Contáctanos ahora
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
