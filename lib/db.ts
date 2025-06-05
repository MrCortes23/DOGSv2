import { Pool } from "pg"

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

// Función para probar la conexión
export async function testConnection() {
  try {
    console.log('Intentando conectar a la base de datos...');
    const client = await db.connect();
    console.log('Conexión establecida correctamente');
    client.release();
    return true;
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    return false;
  }
}

export async function getTableInfo() {
  try {
    const client = await db.connect()
    
    // Obtener información de todas las tablas
    const tables = await client.query(
      `SELECT table_name 
       FROM information_schema.tables 
       WHERE table_schema = 'public'`
    );
    
    // Obtener información de las columnas de cada tabla
    const columns = await client.query(
      `SELECT table_name, column_name, data_type 
       FROM information_schema.columns 
       WHERE table_schema = 'public'`
    );
    
    client.release()
    return { tables: tables.rows, columns: columns.rows };
  } catch (error) {
    console.error("Error al obtener información de las tablas:", error)
    throw error;
  }
}

export { db }
export default db;
