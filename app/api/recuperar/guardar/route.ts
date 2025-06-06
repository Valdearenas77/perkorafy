import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token, nuevaPassword } = await req.json();

    if (!token || !nuevaPassword) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExp: {
          gt: new Date(), // aún no ha expirado
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Token inválido o expirado" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExp: null,
      },
    });

    return NextResponse.json({ message: "Contraseña actualizada" });
  } catch (error) {
    console.error("Error al guardar nueva contraseña:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
