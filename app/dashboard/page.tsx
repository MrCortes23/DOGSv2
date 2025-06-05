"use client"

import Resumen from "@/components/dashboard/Resumen"

export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Bienvenido a tu Informacion Canina</h1>
      <Resumen />
    </div>
  )
}
