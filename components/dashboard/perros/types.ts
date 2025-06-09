export interface Raza {
  id_raza_pk: number
  tipo_de_raza: string
  tamano: string
}

export interface Enfermedad {
  id_enfermedad_pk: number
  tipo_de_enfermedad: string
}

export interface Perro {
  id_perro_pk: number
  id_cliente_fk: number
  nombre: string
  edad: string
  sexo: string
  id_raza_fk?: number
  id_enfermedad_fk?: number | null
  foto_data?: Buffer
  raza?: string
  enfermedad?: string
  razas?: Array<{
    id_raza_pk: number
    tipo_de_raza: string
  }>
  enfermedades?: Array<{
    id_enfermedad_pk: number
    tipo_de_enfermedad: string
  }>
}

export interface PerroFormData {
  nombre: string
  edad: string
  sexo: string
  id_raza_fk: number
  id_enfermedad_fk?: number | null
  foto?: File
}

export interface PerroFormProps {
  onSubmit: (formData: FormData) => Promise<void>
  razas: Raza[]
  enfermedades: Enfermedad[]
}
