import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { hash } from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET ?? 'clave_super_secreta'

export async function POST(req: NextRequest) {
  const token = req.cookies.get('adminToken')?.value

  if (!token) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  try {
    const { password } = await req.json()

    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number }

    const hashedPassword = await hash(password, 10)

    await prisma.admin.update({
      where: { id: decoded.id },
      data: { password: hashedPassword },
    })

    return NextResponse.json({ message: 'Contraseña actualizada correctamente' })
  } catch (err) {
    console.error('[API ADMIN UPDATE PASSWORD]', err)
    return NextResponse.json({ error: 'Error al actualizar la contraseña' }, { status: 500 })
  }
}
