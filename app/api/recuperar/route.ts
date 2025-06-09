import { prisma } from "@/lib/prisma";
import { sendRecoveryEmail } from "@/lib/mailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET ?? "clave_super_secreta";

// FASE 1: Solicitud de recuperación => genera y envía el token
export async function POST(req: Request) {
  try {
    const { email, token, password } = await req.json();

    // Si se recibe solo el email => FASE 1: generar token y enviar mail
    if (email && !token && !password) {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
      }

      const jwtToken = jwt.sign(
        {
          userId: user.id,
          email: user.email,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      await sendRecoveryEmail(email, jwtToken);

      return NextResponse.json({ message: "Correo de recuperación enviado" });
    }

    // Si se recibe token + nueva password => FASE 2: guardar nueva contraseña
    if (token && password) {
      let datos;
      try {
        datos = jwt.verify(token, JWT_SECRET) as { userId: number };
      } catch (err) {
        return NextResponse.json({ error: "Token inválido o ha expirado" }, { status: 401 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.update({
        where: { id: datos.userId },
        data: {
          password: hashedPassword,
        },
      });

      return NextResponse.json({ message: "Contraseña actualizada correctamente" });
    }

    return NextResponse.json({ error: "Solicitud no válida" }, { status: 400 });
  } catch (error) {
    console.error("Error en /api/recuperar:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

