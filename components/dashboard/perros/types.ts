export interface Raza {
  id_raza_pk: number
  tipo_de_raza: string
  tamano: string
}

export interface Perro {
  id_perro_pk: number
  id_cliente_fk: number
  nombre: string
  edad: string
  sexo: string
  id_raza_fk?: number
  foto_data?: Buffer
  raza?: string
}

export interface PerroFormData {
  nombre: string
  edad: string
  sexo: string
  id_raza_fk: number
  foto?: File
}

export interface PerroFormProps {
  onSubmit: (formData: FormData) => Promise<void>
  razas: Raza[]
}
