"use client"
import SimpleHeroCarousel from "../components/carrousel"
import MainServices from "../components/tarjetaservicio"
import Testimonial from "../components/testimonios"
import DiagonalSection from "../components/diagonal"

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      
      <SimpleHeroCarousel />

      <MainServices />

      <DiagonalSection />
      
      <Testimonial />
    </div>
  )
} 