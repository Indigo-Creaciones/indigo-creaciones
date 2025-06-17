import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { name, email, phone, subject, message } = req.body;

  if (!name || !phone || !subject || !message) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: `Nuevo mensaje de contacto: ${subject}`,
      replyTo: email || undefined,
      text: `Nombre: ${name}\nEmail: ${email || 'No proporcionado'}\nTeléfono: ${phone}\nAsunto: ${subject}\nMensaje: ${message}`,
      html: `<h2>Nuevo mensaje de contacto</h2>
        <p><b>Nombre:</b> ${name}</p>
        <p><b>Email:</b> ${email || 'No proporcionado'}</p>
        <p><b>Teléfono:</b> ${phone}</p>
        <p><b>Asunto:</b> ${subject}</p>
        <p><b>Mensaje:</b><br/>${message.replace(/\n/g, '<br/>')}</p>`
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error enviando email:', error);
    return res.status(500).json({ error: 'Error enviando email' });
  }
}
