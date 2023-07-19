import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: Request) {
  const { name, email, feedback } = await req.json();
  if (!name || !email || !feedback) {
    return NextResponse.json({
      message: `Campos requeridos vacíos!`,
    });
  }
  const info = await transporter.sendMail({
    from: `"${process.env.SMTP_NAME}" <${process.env.SMTP_USER}>`, // sender address
    to: `${email}, ${process.env.SMTP_USER}`, // list of receivers
    subject: `Formulario de Feedback`, // Subject line
    text: `Feedback enviado por ${name} (${email}) \n "${feedback}"`, // plain text body
    html: /*html*/ `
      <h1>Feedback enviado por ${name} (${email})</h1>
      <p>${feedback}</p>
    `,
  });
  if (info.messageId) {
    return NextResponse.json({
      message: `Email enviado com sucesso!`,
    });
  } else {
    return NextResponse.json({
      message: `Error al enviar el email!`,
    });
  }
}
