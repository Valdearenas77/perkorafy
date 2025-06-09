import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import jwt from "jsonwebtoken"
import { sendPasswordResetEmail } from "@/lib/email/sendPasswordResetEmail" // Usa tu función de email real

const JWT_SECRET = process.env.JWT_SECRET ?? "clave_super_secreta"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(params.id) },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // Generar token de recuperación
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    )

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/recuperar?token=${token}`

    // Enviar correo
    await sendPasswordResetEmail({ email: user.email, nombre: user.name, url })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[RESET PASSWORD]", err)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
