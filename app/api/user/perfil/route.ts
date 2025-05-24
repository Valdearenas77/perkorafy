import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
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
        name: true,
        email: true,
        perks: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error al verificar token:", error)
    return NextResponse.json({ error: "Token inválido" }, { status: 401 })
  }
}

export async function PUT(req: NextRequest) {
  const token = cookies().get("token")?.value

  if (!token) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number }
    const { name } = await req.json()

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: "Nombre inválido" }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: { name },
      select: { name: true },
    })

    return NextResponse.json({ message: "Nombre actualizado", user: updatedUser })
  } catch (error) {
    console.error("Error al actualizar nombre:", error)
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 })
  }
}
