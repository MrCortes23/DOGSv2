"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"

interface FAQ {
  id: number
  question: string
  answer: string
}

const faqs: FAQ[] = [
  {
    id: 1,
    question: "¿Qué debo llevar para la primera visita?",
    answer:
      "Para la primera visita, te recomendamos traer el carnet de vacunación de tu mascota, su comida habitual si tiene una dieta especial, y cualquier medicamento que necesite.",
  },
  {
    id: 2,
    question: "¿Cómo puedo cancelar o reprogramar una cita?",
    answer:
      "Puedes cancelar o reprogramar tu cita hasta 24 horas antes a través de tu cuenta en nuestra plataforma o llamándonos directamente.",
  },
  {
    id: 3,
    question: "¿Aceptan mascotas con necesidades especiales?",
    answer:
      "Sí, contamos con personal capacitado para atender mascotas con necesidades especiales. Por favor, indícanos los requerimientos específicos al momento de agendar.",
  },
  {
    id: 4,
    question: "¿Qué métodos de pago aceptan?",
    answer:
      "Aceptamos efectivo, tarjetas de crédito/débito y transferencias bancarias. También puedes pagar a través de nuestra plataforma online.",
  },
]

export default function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Formulario enviado:", formData)
    // Aquí puedes agregar la lógica para enviar el formulario
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const fadeInUp = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  const controls = useAnimation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Verificar si estamos en el navegador
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      
      // Verificar al montar
      checkMobile();
      
      // Configurar el listener para cambios de tamaño
      window.addEventListener('resize', checkMobile);
      
      // Iniciar animación en móvil
      if (isMobile) {
        controls.start("visible");
      }
      
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, [controls, isMobile]);

  return (
    <motion.section 
      className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white w-full overflow-hidden"
      initial="hidden"
      animate={isMobile ? controls : undefined}
      whileInView={!isMobile ? "visible" : undefined}
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          variants={fadeInUp}
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-black to-green-500 mb-6">Contáctanos</h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            <motion.span variants={fadeInUp}>Estamos aquí para responder tus preguntas y ayudarte con todo lo que necesites para el cuidado de tu mascota</motion.span>
          </p>
        </motion.div>

        {/* Contact Info and Form */}
        <motion.div 
          className="grid lg:grid-cols-2 gap-12 mb-16"
          variants={containerVariants}
        >
          {/* Contact Information */}
          <motion.div 
            className="space-y-8"
            variants={itemVariants}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-green-800 mb-8">Información de Contacto</h3>

            {/* Address */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-black mb-2">Dirección</h4>
                <p className="text-gray-600">Funza, Cundinamarca</p>
                <p className="text-gray-600">Calle 27 #5-142</p>
                <p className="text-gray-600">Colombia</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-black mb-2">Teléfono</h4>
                <p className="text-gray-600">(301) 8268642</p>
               
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-black mb-2">Email</h4>
                <p className="text-gray-600"><a href="mailto:guarderiacampestredogs@gmail.com" className="text-blue-600 hover:underline">guarderiacampestredogs@gmail.com</a></p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-black mb-2">Horario</h4>
                <p className="text-gray-600">Lunes a Viernes: 7:00 AM - 8:00 PM</p>
                <p className="text-gray-600">Sábados: 8:00 AM - 6:00 PM</p>
                <p className="text-gray-600">Domingos: 9:00 AM - 3:00 PM</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-8"
            variants={itemVariants}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-black mb-8">Envíanos un mensaje</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="(123) 456-7890"
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Asunto *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Escribe tu mensaje aquí..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-green-800 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Enviar mensaje</span>
              </button>
            </form>
          </motion.div>
        </motion.div>

        {/* Map Section */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isMobile ? controls : undefined}
          whileInView={!isMobile ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.318724640342!2d-74.19792822499886!3d4.714590541536977!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f83c13b8544cd%3A0x7937a7b8e3fc84bd!2sCl.%2027%20%235-142%2C%20Funza%2C%20Cundinamarca!5e0!3m2!1ses-419!2sco!4v1748545183433!5m2!1ses-419!2sco"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-96"
            />
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isMobile ? controls : undefined}
          whileInView={!isMobile ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          <h3 className="text-3xl md:text-4xl font-bold text-green-800 text-center mb-12">Preguntas Frecuentes</h3>

          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq) => (
              <motion.div
                key={faq.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                variants={itemVariants}
              >
                <h4 className="text-lg font-semibold text-gray-900 mb-4">{faq.question}</h4>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isMobile ? controls : undefined}
          whileInView={!isMobile ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          <motion.div 
            className="bg-gradient-to-r from-gray-600 to-green-800 rounded-2xl p-8 text-white"
            variants={fadeInUp}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4">¿Tienes más preguntas?</h3>
            <p className="text-blue-100 mb-6 text-lg">No dudes en contactarnos, estamos aquí para ayudarte</p>
            <motion.button 
              className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition-colors duration-300 transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Llamar Ahora
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}
