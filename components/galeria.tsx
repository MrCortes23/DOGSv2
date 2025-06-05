/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { PawPrint } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface GalleryImage {
  id: number
  src: string
  alt: string
  className: string
}

interface GallerySection {
  id: string
  title: string
  description: string
  images: GalleryImage[]
  gridClass: string
}

const gallerySections: GallerySection[] = [
  {
    id: "espacios",
    title: "Espacios",
    description:
      "Descubre nuestras amplias instalaciones diseñadas especialmente para el bienestar y diversión de tu mascota.",
    gridClass: "grid-cols-4 grid-rows-4",
    images: [
      {
        id: 1,
        src: "/images/sg.jpg",
        alt: "Área de juegos principal",
        className: "col-span-2 row-span-3",
      },
      {
        id: 2,
        src: "/images/loquito.jpg",
        alt: "Zona de descanso",
        className: "col-span-1 row-span-1",
      },
      {
        id: 3,
        src: "/images/frenchie.jpg",
        alt: "Piscina canina",
        className: "col-span-1 row-span-1",
      },
      {
        id: 4,
        src: "/images/macarena.jpg",
        alt: "Jardín exterior",
        className: "col-span-1 row-span-2",
      },
      {
        id: 5,
        src: "/images/pelotan.jpg",
        alt: "Área de alimentación",
        className: "col-span-1 row-span-2",
      },
      {
        id: 6,
        src: "/images/locopiojo.jpg",
        alt: "Sala de entrenamiento",
        className: "col-span-3 row-span-1",
      },
      {
        id: 7,
        src: "/images/pisop.jpg",
        alt: "Zona de grooming",
        className: "col-span-1 row-span-1   ",
      },
    ],
  },
  {
    id: "eventos",
    title: "Eventos",
    description: "Momentos especiales y actividades únicas que organizamos para crear experiencias inolvidables.",
    gridClass: "grid-cols-3 grid-rows-3",
    images: [
      {
        id: 1,
        src: "/images/dosventi.jpg",
        alt: "Evento año nuevo 2024",
        className: "col-span-1 row-span-2",
      },
      {
        id: 2,
        src: "/images/dosventi5.jpg",
        alt: "2024",
        className: "col-span-2 row-span-1",
      },
      {
        id: 3,
        src: "/images/dosventi3.jpg",
        alt: "2024",
        className: "col-span-1 row-span-1",
      },
      {
        id: 4,
        src: "/images/dosventi4.jpg",
        alt: "2024",
        className: "col-span-1 row-span-1",
      },
      {
        id: 5,
        src: "/images/navidad1.jpg",
        alt: "Evento de navidad",
        className: "col-span-1 row-span-2",
      },
      {
        id: 6,
        src: "/images/ramon2.jpg",
        alt: "Navidad",
        className: "col-span-2 row-span-1",
      },
      {
        id: 7,
        src: "/images/navidad3.jpg",
        alt: "Navidad",
        className: "col-span-1 row-span-1",
      },
      {
        id: 8,
        src: "/images/navidad4.jpg",
        alt: "Navidad",
        className: "col-span-1 row-span-1",
        
      },
    ],
  },
  {
    id: "momentos",
    title: "Momentos",
    description: "Capturamos los momentos más tiernos y divertidos de nuestros huéspedes de cuatro patas.",
    gridClass: "grid-cols-3 grid-rows-4",
    images: [
      { id: 1, src: "/images/sosito2.jpg", 
        alt: "Chivo negro", 
        className: "col-span-1 row-span-1" },
      {
        id: 2,
        src: "/images/caminata.jpg",
        alt: "Paseo a piedras de chivonegro",
        className: "col-span-2 row-span-2",
      },
      {
        id: 3,
        src: "/images/socios.jpg",
        alt: "Chivo negro",
        className: "col-span-1 row-span-1",
      },
      {
        id: 4,
        src: "/images/disfraces.jpg",
        alt: "Disfraces en la guarderia",
        className: "col-span-1 row-span-3",
      },
      {
        id: 5,
        src: "/images/disfraces2.jpg",
        alt: "Disfraz",
        className: "col-span-1 row-span-1",
      },
      {
        id: 6,
        src: "/images/disfraces3.jpg",
        alt: "Disfraz",
        className: "col-span-1 row-span-1",
      },
      {
        id: 7,
        src: "/images/disfraces4.jpg",
        alt: "Disfraz",
        className: "col-span-1 row-span-1",
      },
      {
        id: 8,
        src: "/images/disfraces5.jpg",
        alt: "Disfraz",
        className: "col-span-1 row-span-1",
      },
    ],
  },
  {
    id: "cumpleanos",
    title: "Cumpleaños",
    description:
      "Celebraciones especiales llenas de alegría, pasteles caninos y mucha diversión para nuestros cumpleañeros.",
    gridClass: "grid-cols-3 grid-rows-3",
    images: [
      {
        id: 1,
        src: "/images/cumpleanos5.jpg",
        alt: "Fiesta de cumpleaños",
        className: "col-span-2 row-span-2",
      },
      { id: 2, src: "/images/cumpleanos2.jpg", 
        alt: "Pastel canino", 
        className: "col-span-1 row-span-1" },
      {
        id: 3,
        src: "/images/cumpleanos3.jpg",
        alt: "Cumpleaños",
        className: "col-span-1 row-span-1",
      },
      {
        id: 4,
        src: "/images/cumpleanos4.jpg",
        alt: "Regalos especiales",
        className: "col-span-1 row-span-1",
      },
      {
        id: 5,
        src: "/images/cumpleanos8.jpg",
        alt: "Decoración festiva",
        className: "col-span-1 row-span-1",
      },
      {
        id: 6,
        src: "/images/cumpleanos7.jpg",
        alt: "Invitados especiales",
        className: "col-span-1 row-span-1",
      },

    ],
  },
]

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const imageItem = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};


export default function GallerySection() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const controls = useAnimation();
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  return (
    <motion.section 
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={fadeInUp}
      className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white w-full"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <motion.div 
          className="text-center mb-16 w-full"
          variants={fadeInUp}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-black to-green-500">Bienvenido a la Galería Canina</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Observa y anímate a darle una oportunidad a tu canino para que explore la guardería Campestre DOGS!
          </p>
          
        </motion.div>

        {/* Gallery Sections */}
        <motion.div 
          className="space-y-30"
          variants={staggerContainer}
        >
          {gallerySections.map((section, sectionIndex) => (
            <motion.div 
              key={section.id} 
              className="group"
              variants={fadeInUp}
            >
              {/* Section Header */}
              <motion.div 
                className="w-full max-w-7xl mx-auto mb-10"
                variants={fadeInUp}
              >
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <div className="px-6 py-2 bg-gray-100 rounded-lg shadow-lg">
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-800 text-center inline-flex items-center">
                        <span className="mr-3 inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                          <PawPrint className="w-5 h-5 text-green-800" />
                        </span>
                        {section.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Mosaic Grid */}
              <motion.div 
                className={`grid ${section.gridClass} gap-2 min-h-[300px] max-w-5xl mx-auto`}
                variants={staggerContainer}
                initial="hidden"
                animate={controls}
              >
                {section.images.map((image) => (
                  <motion.div 
                    key={image.id}
                    className={`${image.className} relative overflow-hidden rounded-lg cursor-pointer group/image h-full w-full`}
                    onClick={() => setSelectedImage(image.src)}
                    variants={imageItem}
                  >
                    <img
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-110"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white font-semibold text-sm md:text-base">{image.alt}</p>
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"></div>

                    {/* Zoom Icon */}
                    <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
                      <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              {/* Consistent spacing between sections */}
              {sectionIndex < gallerySections.length - 1 && <div className="h-6"></div>}
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-gray-600 to-green-800 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">¿Te gustó lo que viste?</h3>
            <p className="text-green-100 mb-6 text-lg">
              Agenda una visita y conoce personalmente nuestras instalaciones
            </p>
            <button 
              onClick={() => router.push('/contacto')}
              className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition-colors duration-300 transform hover:scale-105">
              Agendar Visita
            </button>
          </div>
        </div>
      </div>

      {/* Modal for enlarged image */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Imagen ampliada"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </motion.section>
  )
}
