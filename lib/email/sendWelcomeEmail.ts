import nodemailer from "nodemailer";
import path from "path";

export async function sendWelcomeEmail({
  nombre,
  email,
}: {
  nombre: string;
  email: string;
}) {
  console.log(`[EMAIL] Preparando envío de bienvenida a ${email}`);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT!),
    secure: true,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });

  const htmlContent = `
    <table style="max-width: 600px; margin: 0 auto; font-family: sans-serif; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <tr style="background-color: #f9fafb;">
        <td style="padding: 20px; text-align: center;">
          <img src="cid:logo" alt="Perkorafy" style="height: 60px; margin-bottom: 20px;" />
          <h2 style="color: #1f2937;">¡Bienvenido/a a Perkorafy!</h2>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px; color: #374151; font-size: 16px;">
          <p>Hola <strong>${nombre}</strong>,</p>
          <p>Te damos la bienvenida a <strong>Perkorafy</strong>, la plataforma donde puedes canjear tus puntos por beneficios exclusivos pensados para ti.</p>
          <ul>
            <li>🎁 Explora un catálogo de perks siempre actualizado.</li>
            <li>⚡ Canjea tus puntos con un solo clic.</li>
            <li>📈 Disfruta de recompensas por tu implicación y compromiso.</li>
          </ul>
          <p>Ya puedes iniciar sesión en la plataforma con tu correo electrónico registrado. Si no tienes contraseña, solicita una desde la pantalla de acceso.</p>
          <p>¡Nos alegra tenerte con nosotros!</p>
          <p>— El equipo de Perkorafy</p>
        </td>
      </tr>
    </table>
  `;

  const logoPath = path.join(process.cwd(), "public/images/logo.png");

  const mailOptions = {
    from: `"Perkorafy" <${process.env.SMTP_FROM!}>`,
    to: email,
    subject: "¡Bienvenido/a a Perkorafy!",
    html: htmlContent,
    attachments: [
      {
        filename: "logo.png",
        path: logoPath,
        cid: "logo", // Usado en <img src="cid:logo" />
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Enviado a ${email}. Message ID: ${info.messageId}`);
  } catch (err) {
    console.error(`[EMAIL ERROR] No se pudo enviar a ${email}:`, err);
  }
}

