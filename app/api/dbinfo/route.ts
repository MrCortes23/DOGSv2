import { NextResponse } from 'next/server';
import { getTableInfo } from '@/lib/db';

export async function GET() {
  try {
    const dbInfo = await getTableInfo();
    return NextResponse.json(dbInfo);
  } catch (error) {
    console.error('Error al obtener información de la base de datos:', error);
    return NextResponse.json(
      { error: 'Error al obtener información de la base de datos' },
      { status: 500 }
    );
  }
}
