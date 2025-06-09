import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET ?? 'clave_super_secreta';

export async function POST(req: Request) {
  try {
    const { token, nuevaPassword } = await req.json();

    if (!token || !nuevaPassword) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET) as { email: string };
    } catch (err) {
      return NextResponse.json({ error: "Token inválido o expirado" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: payload.email } });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);

    await prisma.user.update({
      where: { email: payload.email },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "Contraseña actualizada" });
  } catch (error) {
    console.error("Error al guardar nueva contraseña:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
