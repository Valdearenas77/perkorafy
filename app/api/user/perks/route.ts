import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET ?? 'clave_super_secreta'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  if (!token) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const decoded: any = verify(token, JWT_SECRET)
    const user = await prisma.user.findUnique({ where: { email: decoded.email } })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ perks: user.perks })
  } catch (error) {
    console.error('Error al verificar token:', error)
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
  }
}
