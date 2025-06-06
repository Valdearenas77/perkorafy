import { prisma } from "@/lib/prisma";
import { sendRecoveryEmail } from "@/lib/mailer";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const token = randomUUID();
    const expiration = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

    await prisma.user.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExp: expiration,
      },
    });

    await sendRecoveryEmail(email, token);

    return NextResponse.json({ message: "Correo de recuperación enviado" });
  } catch (error) {
    console.error("Error en /api/recuperar:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
