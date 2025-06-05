export interface Servicio {
  id_servicio_pk: number
  tipo_de_servicio: string
  valor: number
  id_costo_pk: number
}

export interface Cita {
  id_cita_pk: number
  fecha: string
  horario_disponible: string
  costo_total: number
  observaciones: string
  nombre_empleado: string
  nombre_perro: string
  pagada: boolean
  id_perro_fk: number
}
