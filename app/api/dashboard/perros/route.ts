import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import { cookies } from 'next/headers'

// Verificar si la base de datos está configurada
if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL no está configurado')
  throw new Error('DATABASE_URL no está configurado')
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// Function to get user data from cookie
async function getUserDataFromCookie() {
  try {
    const allCookies = await cookies()
    const userCookie = allCookies.get('user')
    
    if (!userCookie) {
      console.log('No se encontró cookie de usuario')
      return null
    }

    const userData = JSON.parse(decodeURIComponent(userCookie.value))
    if (!userData || !userData.id) {
      console.log('Usuario inválido:', userData)
      return null
    }

    return userData
  } catch (error) {
    console.error('Error al obtener datos de usuario:', error)
    return null
  }
}

export async function GET() {
  try {
    console.log('Iniciando petición GET...')
    
    const userData = await getUserDataFromCookie()
    if (!userData) {
      console.log('No hay datos de usuario en la cookie')
      return NextResponse.json({
        success: false,
        error: 'No hay sesión activa',
        details: 'No se encontró cookie de usuario'
      }, { status: 401 })
    }

    console.log('Usuario decodificado:', userData)

    // Verificar si la conexión a la base de datos está funcionando
    try {
      await pool.query('SELECT 1')
      console.log('Conexión a la base de datos exitosa')
    } catch (dbError) {
      console.error('Error al conectar a la base de datos:', dbError)
      return NextResponse.json({
        success: false,
        error: 'Error al conectar a la base de datos',
        details: dbError instanceof Error ? dbError.message : 'Error desconocido'
      }, { status: 500 })
    }

    const perrosRes = await pool.query(
      `
        SELECT 
          p.id_perro_pk,
          p.id_cliente_fk,
          p.nombre,
          p.edad,
          p.sexo,
          pr.id_raza_fk,
          r.tipo_de_raza as raza,
          p.foto_data
        FROM perro p
        LEFT JOIN perro_raza pr ON p.id_perro_pk = pr.id_perro_fk
        LEFT JOIN raza r ON pr.id_raza_fk = r.id_raza_pk
        WHERE p.id_cliente_fk = $1
        ORDER BY p.nombre ASC
      `,
      [userData.id]
    )

    console.log('Perros encontrados:', perrosRes.rows)

    return NextResponse.json({
      success: true,
      perros: perrosRes.rows
    })
  } catch (error) {
    console.error('Error en la API:', error)
    
    // Asegurarse de que siempre devolvemos JSON válido
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    const errorDetails = error instanceof Error ? error.stack : undefined

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: errorDetails
      },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export async function POST(request: Request) {
  try {
    const userData = await getUserDataFromCookie()
    if (!userData) {
      return NextResponse.json({
        success: false,
        error: 'No hay sesión activa',
        details: 'No se encontró cookie de usuario'
      }, { status: 401 })
    }

    const formData = await request.formData()
    const nombre = formData.get('nombre') as string
    const edad = formData.get('edad') as string
    const sexo = formData.get('sexo') as string
    const id_raza_fk = formData.get('id_raza_fk') as string
    const foto = formData.get('foto') as File

    if (!nombre || !edad || !sexo || !id_raza_fk) {
      return NextResponse.json({
        success: false,
        error: 'Faltan campos requeridos',
        details: 'Campos requeridos: nombre, edad, sexo, id_raza_fk'
      }, { status: 400 })
    }

    // Convertir edad a número
    const edadNum = parseInt(edad)
    if (isNaN(edadNum)) {
      return NextResponse.json({
        success: false,
        error: 'Edad inválida'
      }, { status: 400 })
    }

    // Convertir ID de raza a número
    const idRazaNum = parseInt(id_raza_fk)
    if (isNaN(idRazaNum)) {
      return NextResponse.json({
        success: false,
        error: 'ID de raza inválido'
      }, { status: 400 })
    }

    let foto_data = null
    if (foto) {
      foto_data = Buffer.from(await foto.arrayBuffer())
    }

    // Primero insertamos el perro
    const perroResult = await pool.query(
      `
        INSERT INTO perro (nombre, edad, sexo, foto_data, id_cliente_fk)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id_perro_pk
      `,
      [nombre, edadNum.toString(), sexo, foto_data, userData.id]
    )

    const idPerro = perroResult.rows[0].id_perro_pk

    // Luego insertamos en la tabla de relación
    await pool.query(
      `
        INSERT INTO perro_raza (id_perro_fk, id_raza_fk)
        VALUES ($1, $2)
      `,
      [idPerro, idRazaNum]
    )

    // Finalmente obtenemos el perro completo con su raza
    const perroFinal = await pool.query(
      `
        SELECT 
          p.id_perro_pk,
          p.id_cliente_fk,
          p.nombre,
          p.edad,
          p.sexo,
          pr.id_raza_fk,
          r.tipo_de_raza as raza,
          p.foto_data
        FROM perro p
        LEFT JOIN perro_raza pr ON p.id_perro_pk = pr.id_perro_fk
        LEFT JOIN raza r ON pr.id_raza_fk = r.id_raza_pk
        WHERE p.id_perro_pk = $1
      `,
      [idPerro]
    )

    return NextResponse.json({
      success: true,
      perro: perroFinal.rows[0]
    })
  } catch (error) {
    console.error('Error en POST:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const userData = await getUserDataFromCookie()
    if (!userData) {
      return NextResponse.json({
        success: false,
        error: 'No se encontró sesión activa'
      }, { status: 401 })
    }

    const formData = await request.formData()
    const id_perro_pk = formData.get('id_perro_pk')
    if (!id_perro_pk) {
      return NextResponse.json({
        success: false,
        error: 'ID del perro es requerido'
      }, { status: 400 })
    }

    const nombre = formData.get('nombre') as string
    const edad = formData.get('edad') as string
    const sexo = formData.get('sexo') as string
    const id_raza_fk = formData.get('id_raza_fk') as string | null
    const foto = formData.get('foto') as File | null
    const foto_actual = formData.get('foto_actual') as string | null

    if (!nombre || !edad || !sexo) {
      return NextResponse.json({
        success: false,
        error: 'Campos requeridos: nombre, edad, sexo'
      }, { status: 400 })
    }

    let foto_data = null
    if (foto) {
      foto_data = Buffer.from(await foto.arrayBuffer())
    } else if (foto_actual !== 'true') {
      foto_data = null
    }

    // Primero actualizamos el perro
    const perroResult = await pool.query(
      `
        UPDATE perro 
        SET 
          nombre = $1,
          edad = $2,
          sexo = $3,
          foto_data = CASE 
            WHEN $4::bytea IS NOT NULL THEN $4::bytea
            ELSE foto_data
          END,
          id_cliente_fk = $5
        WHERE id_perro_pk = $6
        RETURNING id_perro_pk
      `,
      [nombre, edad, sexo, foto_data || null, userData.id, id_perro_pk]
    )

    const idPerro = perroResult.rows[0].id_perro_pk

    // Luego actualizamos la tabla de relación
    if (id_raza_fk) {
      await pool.query(
        `
          UPDATE perro_raza 
          SET id_raza_fk = $1
          WHERE id_perro_fk = $2
        `,
        [id_raza_fk, idPerro]
      )
    }

    // Finalmente obtenemos el perro actualizado
    const perroFinal = await pool.query(
      `
        SELECT 
          p.id_perro_pk,
          p.id_cliente_fk,
          p.nombre,
          p.edad,
          p.sexo,
          pr.id_raza_fk,
          r.tipo_de_raza as raza,
          p.foto_data
        FROM perro p
        LEFT JOIN perro_raza pr ON p.id_perro_pk = pr.id_perro_fk
        LEFT JOIN raza r ON pr.id_raza_fk = r.id_raza_pk
        WHERE p.id_perro_pk = $1
      `,
      [idPerro]
    )

    return NextResponse.json({
      success: true,
      perro: perroFinal.rows[0]
    })
  } catch (error) {
    console.error('Error en PUT:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const userData = await getUserDataFromCookie()
    if (!userData) {
      return NextResponse.json({
        success: false,
        error: 'No hay sesión activa',
        details: 'No se encontró cookie de usuario'
      }, { status: 401 })
    }

    // Obtener el ID del perro desde los parámetros de la URL
    const url = new URL(request.url)
    const id = url.searchParams.get('id_perro_pk')

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID del perro es requerido'
      }, { status: 400 })
    }

    // Primero eliminamos las facturas relacionadas
    await pool.query(
      `
        DELETE FROM factura 
        WHERE id_cita_fk IN (
          SELECT id_cita_pk FROM cita WHERE id_perro_fk = $1
        )
      `,
      [id]
    )

    // Luego eliminamos las citas relacionadas
    await pool.query(
      `
        DELETE FROM cita 
        WHERE id_perro_fk = $1
      `,
      [id]
    )

    // Luego eliminamos la relación
    await pool.query(
      `
        DELETE FROM perro_raza 
        WHERE id_perro_fk = $1
      `,
      [id]
    )

    // Finalmente eliminamos el perro
    const result = await pool.query(
      `
        DELETE FROM perro 
        WHERE id_perro_pk = $1 
        AND id_cliente_fk = $2
        RETURNING id_perro_pk
      `,
      [id, userData.id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No se encontró el perro'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Perro eliminado exitosamente'
    })
  } catch (error) {
    console.error('Error en DELETE:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}