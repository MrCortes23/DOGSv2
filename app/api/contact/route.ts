import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Configura el transporte de correo
const transporter = nodemailer.createTransport({
  service: 'gmail', // o el servicio de correo que uses
  auth: {
    user: process.env.EMAIL_USER, // Tu correo electrónico
    pass: process.env.EMAIL_PASS, // Tu contraseña de aplicación
  },
});

export async function POST(request: Request) {
  try {
    const { fullName, email, phone, subject, message } = await request.json();

    // Validar los datos del formulario
    if (!fullName || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Por favor completa todos los campos obligatorios' },
        { status: 400 }
      );
    }

    // Configurar el correo electrónico con diseño mejorado
    const mailOptions = {
      from: `"${fullName}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Nuevo mensaje de contacto: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nuevo mensaje de contacto</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #047857;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              padding: 20px;
              border: 1px solid #e2e8f0;
              border-top: none;
              border-radius: 0 0 8px 8px;
            }
            .info-box {
              background-color: #f8fafc;
              border-left: 4px solid #047857;
              padding: 15px;
              margin: 15px 0;
            }
            .info-item {
              margin-bottom: 10px;
            }
            .info-label {
              font-weight: bold;
              color: #1e293b;
              display: inline-block;
              width: 100px;
            }
            .message-box {
              background-color: #f1f5f9;
              padding: 15px;
              border-radius: 6px;
              margin-top: 20px;
            }
            .footer {
              margin-top: 30px;
              font-size: 12px;
              color: #64748b;
              text-align: center;
              border-top: 1px solid #e2e8f0;
              padding-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">Nuevo mensaje de contacto</h1>
            <p style="margin: 5px 0 0; opacity: 0.9; font-size: 14px;">Guardería Campestre Dogs</p>
          </div>
          
          <div class="content">
            <div class="info-box">
              <div class="info-item">
                <span class="info-label">De:</span>
                ${fullName}
              </div>
              <div class="info-item">
                <span class="info-label">Email:</span>
                <a href="mailto:${email}" style="color: #047857; text-decoration: none;">${email}</a>
              </div>
              ${phone ? `
                <div class="info-item">
                  <span class="info-label">Teléfono:</span>
                  <a href="tel:${phone}" style="color: #047857; text-decoration: none;">${phone}</a>
                </div>
              ` : ''}
              <div class="info-item">
                <span class="info-label">Asunto:</span>
                ${subject}
              </div>
            </div>
            
            <div class="message-box">
              <h3 style="margin-top: 0; color: #047857;">Mensaje:</h3>
              <p style="white-space: pre-line; margin: 0;">${message}</p>
            </div>
            
            <div class="footer">
              <p>Este es un mensaje automático, por favor no responda directamente a este correo.</p>
              <p>© ${new Date().getFullYear()} Guardería Campestre Dogs. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Mensaje enviado correctamente. ¡Nos pondremos en contacto contigo pronto!',
    });

  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return NextResponse.json(
      { error: 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.' },
      { status: 500 }
    );
  }
}
