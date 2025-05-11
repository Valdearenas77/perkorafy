import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || "clave_super_secreta"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.password)

    if (!valid) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 })
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    )

    const response = NextResponse.json({ message: "Login correcto" })

    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60,
      secure: process.env.NODE_ENV === "production", // 👈 solo en prod
      sameSite: "lax",
    })

    return response
  } catch (error) {
    console.error("❌ Error en /api/login:", error)
    return NextResponse.json({ error: "Error interno en el servidor" }, { status: 500 })
  }
}
