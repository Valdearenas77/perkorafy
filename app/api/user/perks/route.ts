import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"

const JWT_SECRET = process.env.JWT_SECRET || "clave_super_secreta"

export async function GET() {
  const token = cookies().get("token")?.value

  if (!token) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        perks: true, // solo obtenemos perks
      }
    })

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ perks: user.perks }) // ✅ estructura esperada por el frontend
  } catch (error) {
    console.error("Token inválido:", error)
    return NextResponse.json({ error: "Token inválido" }, { status: 401 })
  }
}
