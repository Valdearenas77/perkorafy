import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET ?? 'clave_super_secreta'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('adminToken')?.value

  if (!token) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number }

    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, nombre: true }, // ajusta si tu campo se llama distinto
    })

    if (!admin) {
      return NextResponse.json({ error: 'Administrador no encontrado' }, { status: 404 })
    }

    return NextResponse.json(admin)
  } catch (err) {
    console.error('[API ADMIN /ME]', err)
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
  }
}
