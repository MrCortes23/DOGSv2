"use client"

import Facturacion from "@/components/dashboard/facturacion/Facturacion"
import { ToastProvider } from "@/components/dashboard/facturacion/Toast"

export default function FacturacionPage() {
  return (
    <ToastProvider>
      <Facturacion />
    </ToastProvider>
  )
}
