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

    const canjes = await prisma.canje.findMany({
      where: { usuarioId: decoded.userId },
      orderBy: { fecha: "desc" },
      include: {
        perk: {
          select: {
            nombre: true,
            puntos: true,
          },
        },
      },
    })

    return NextResponse.json(canjes)
  } catch (error) {
    console.error("Error al obtener historial de canjes:", error)
    return NextResponse.json({ error: "Token inválido" }, { status: 401 })
  }
}
