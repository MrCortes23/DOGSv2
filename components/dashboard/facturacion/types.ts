export interface Cita {
  id_cita_pk: number;
  fecha: string;
  horario_disponible: string;
  costo_total: number;
  observaciones: string;
  nombre_empleado: string;
  nombre_perro: string;
  estado: string;
  metodo_pago?: string; // Método de pago utilizado
  fecha_pago?: string; // Fecha en que se realizó el pago
  numero_factura?: string; // Número de factura
}

export interface TarjetaCitaProps {
  cita: Cita;
  isSelected: boolean;
  onToggleSelect: () => void;
  onCancelar: () => void;
}

export interface MetodoPagoProps {
  metodoPago: string;
  setMetodoPago: (value: string) => void;
}

export interface FacturacionState {
  citas: Cita[];
  loading: boolean;
  error: string | null;
  pagarCitas: (citaIds: number[], metodoPago: string) => Promise<void>;
  cancelarCita: (citaId: number) => Promise<void>;
  refreshCitas: () => Promise<void>;
}
