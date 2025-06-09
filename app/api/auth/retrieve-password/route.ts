import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    console.log('Iniciando proceso de restablecimiento de contraseña...');
    const { email } = await request.json();
    
    if (!email) {
      console.error('No se proporcionó un correo electrónico');
      return NextResponse.json(
        { error: 'Se requiere un correo electrónico' },
        { status: 400 }
      );
    }

    console.log('Buscando usuario con email:', email);
    
    // 1. Buscar usuario por email
    const client = await db.connect();
    let userRes;
    try {
      userRes = await client.query(
        'SELECT id_cliente_pk, nombre FROM cliente WHERE correo = $1',
        [email]
      );
    } catch (dbError) {
      console.error('Error al buscar en la base de datos:', dbError);
      throw new Error('Error al buscar el usuario');
    }
    
    // Por seguridad, no revelar si el correo existe
    if (userRes.rows.length === 0) {
      client.release();
      console.log('No se encontró usuario con el correo:', email);
      return NextResponse.json(
        { success: true, message: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña' },
        { status: 200 }
      );
    }

    const user = userRes.rows[0];
    
    // 2. Generar token de restablecimiento
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Expira en 1 hora

    try {
      // 3. Guardar token en la base de datos
      await client.query(
        `INSERT INTO password_reset_tokens 
         (id_cliente_fk, token, expires_at, created_at)
         VALUES ($1, $2, $3, NOW())`,
        [user.id_cliente_pk, token, expiresAt]
      );
    } catch (error) {
      console.error('Error al guardar el token:', error);
      throw new Error('Error al procesar la solicitud');
    } finally {
      client.release();
    }

    // 4. Enviar correo con enlace de restablecimiento
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    
    // Verificar variables de entorno
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Faltan variables de entorno para el correo');
      throw new Error('Configuración de correo incompleta');
    }

    console.log('Configurando transporte de correo...');
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    try {
      console.log('Enviando correo a:', email);
      await transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || 'Soporte'}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Restablece tu contraseña',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #047857; font-size: 24px; font-weight: bold; margin-bottom: 20px;">
              Restablece tu contraseña
            </h2>
            <p>Hola ${user.nombre},</p>
            <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="display: inline-block; padding: 12px 24px; 
                        background-color: #047857; color: white; 
                        text-decoration: none; border-radius: 4px;">
                Restablecer contraseña
              </a>
            </div>
            
            <p>O copia y pega este enlace en tu navegador:</p>
            <p style="word-break: break-all; color: #3b82f6;">${resetUrl}</p>
            
            <p>Este enlace expirará en 1 hora.</p>
            
            <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este correo de manera segura.</p>
            
            <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
              Atentamente,<br>
              El equipo de ${process.env.EMAIL_FROM_NAME || 'Soporte'}
            </p>
          </div>
        `,
      });

      console.log('Correo de restablecimiento enviado con éxito');
      return NextResponse.json({
        success: true,
        message: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña',
      });
    } catch (emailError) {
      console.error('Error al enviar el correo:', emailError);
      throw new Error('No se pudo enviar el correo de restablecimiento');
    }
  } catch (error) {
    console.error('Error en el proceso de restablecimiento:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
