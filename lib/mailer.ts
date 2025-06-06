import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true si usas puerto 465, false para 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendRecoveryEmail = async (to: string, token: string) => {
  const recoveryUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/recuperar?token=${token}`;

  await transporter.sendMail({
    from: `"Perkorafy" <${process.env.SMTP_USER}>`,
    to,
    subject: "Recupera tu contraseña - Perkorafy",
    html: `
      <p>Hola,</p>
      <p>Haz clic en el siguiente enlace para recuperar tu contraseña:</p>
      <p><a href="${recoveryUrl}">${recoveryUrl}</a></p>
      <p>Este enlace expirará en 1 hora.</p>
    `,
  });
};
