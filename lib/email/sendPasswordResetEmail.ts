import nodemailer from "nodemailer"

export async function sendPasswordResetEmail({
  nombre,
  email,
  url,
}: {
  nombre: string
  email: string
  url: string
}) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT!),
    secure: true,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  })

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Hola ${nombre},</h2>
      <p>Has solicitado restablecer tu contraseña en <strong>Perkorafy</strong>.</p>
      <p>Puedes crear una nueva contraseña desde este enlace:</p>
      <p>
        <a href="${url}" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Crear nueva contraseña
        </a>
      </p>
      <p>Este enlace estará disponible durante 1 hora.</p>
      <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
      <p>— El equipo de Perkorafy</p>
    </div>
  `

  await transporter.sendMail({
    from: `"Perkorafy" <${process.env.SMTP_USER!}>`,
    to: email,
    subject: "Restablece tu contraseña en Perkorafy",
    html,
  })
}
