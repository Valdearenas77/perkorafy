import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 401 })
  }

  const valid = await bcrypt.compare(password, user.password)

  if (!valid) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 })
  }

  return NextResponse.json({
    message: "Login correcto",
    user: { id: user.id, name: user.name, email: user.email },
  })
}
