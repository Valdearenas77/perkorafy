import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET ?? "clave_super_secreta"

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const token = req.headers.get("cookie")?.split("adminToken=")[1]?.split(";")[0]

  if (!token) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  try {
    jwt.verify(token, JWT_SECRET)

    const deleted = await prisma.user.delete({
      where: { id: parseInt(params.id) },
    })

    return NextResponse.json({ success: true, deleted })
  } catch (err) {
    console.error("[DELETE USUARIO]", err)
    return NextResponse.json({ error: "No se pudo eliminar el usuario" }, { status: 500 })
  }
}
