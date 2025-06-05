import { useState } from 'react';

interface MetodoPagoProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MetodoPago({ value, onChange }: MetodoPagoProps) {
  const [metodos] = useState([
    { id: 'Efectivo', nombre: 'Efectivo' },
    { id: 'Tarjeta de crédito', nombre: 'Tarjeta de crédito' },
    { id: 'Tarjeta de débito', nombre: 'Tarjeta de débito' },
    { id: 'Transferencia bancaria', nombre: 'Transferencia bancaria' },
    { id: 'Aplicación móvil', nombre: 'Aplicación móvil' }
  ]);

  // No convertir a minúsculas, usar el valor exacto
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onChange(value);
  };

  return (
    <div className="relative">
      <select
        value={value}
        onChange={handleChange}
        className="w-48 h-10 pl-3 pr-10 text-base bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Seleccione método de pago</option>
        {metodos.map((metodo) => (
          <option key={metodo.id} value={metodo.id}>
            {metodo.nombre}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-48 h-10 pl-3 pr-10 text-base bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Seleccione método de pago</option>
        {metodos.map((metodo) => (
          <option key={metodo.id} value={metodo.id}>
            {metodo.nombre}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
