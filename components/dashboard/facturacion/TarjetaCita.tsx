import { Cita } from './types';

import { Document, Page, PDFDownloadLink } from '@react-pdf/renderer';
import FacturaPDF from './FacturaPDF';

interface TarjetaCitaProps {
  cita: Cita;
  isSelected: boolean;
  onToggleSelect: () => void;
  onCancelar: () => void;
}

export default function TarjetaCita({
  cita,
  isSelected,
  onToggleSelect,
  onCancelar
}: TarjetaCitaProps) {

  const fechaFormateada = cita.fecha ? new Date(cita.fecha).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Sin fecha';



  return (
    <div className={`w-full bg-white rounded-2xl shadow-md overflow-hidden ${
      isSelected ? 'border-2 border-blue-500' : 'border border-gray-200'
    }`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold text-gray-800">{cita.nombre_perro}</h3>
            {cita.estado === 'pagada' && (
              <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Pagada
              </span>
            )}
          </div>
          {cita.estado !== 'pagada' && (
            <button
              onClick={onCancelar}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Cancelar
            </button>
          )}
        </div>

        <div className="mt-4 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Fecha:</span>
            <span className="font-medium text-gray-800">{fechaFormateada}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Horario:</span>
            <span className="font-medium text-gray-800">{cita.horario_disponible}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Empleado:</span>
            <span className="font-medium text-gray-800">{cita.nombre_empleado}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Costo:</span>
            <span className="font-medium text-gray-800">${cita.costo_total.toLocaleString()}</span>
          </div>
        </div>
      </div>
      {cita.estado === 'pagada' && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            <span className="mr-2">Pagado con:</span>
            <span className="font-medium">{cita.metodo_pago||'Sin método de pago'}</span>
            <span className="ml-1">el </span>
            <span className="font-medium">{cita.fecha_pago ? new Date(cita.fecha_pago).toLocaleDateString('es-CO', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : 'Sin fecha'}</span>
          </div>
          <div className="flex justify-end mt-2">
            {cita.id_cita_pk && cita.fecha && cita.horario_disponible && cita.nombre_perro && cita.nombre_empleado && cita.costo_total ? (
              <PDFDownloadLink
                document={
                  <Document>
                    <Page size="A4">
                      <FacturaPDF cita={cita} />
                    </Page>
                  </Document>
                }
                fileName={`factura_${cita.id_cita_pk}.pdf`}
              >
                {({ loading }: { loading: boolean }) => (
                  <button
                    disabled={loading}
                    className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                    title="Descargar factura"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </button>
                )}
              </PDFDownloadLink>
            ) : (
              <button
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
                disabled
                title="No se puede generar factura"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
      {cita.estado !== 'pagada' && (
        <div className="mt-4">
          <button
            className={`px-4 py-2 ${
              isSelected
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
            onClick={onToggleSelect}
          >
            {isSelected ? 'Seleccionado' : 'Seleccionar'}
          </button>
        </div>
      )}
    </div>
  );
}
