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
    jwt.verify(token, JWT_SECRET)

    const usuarios = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        perks: true,
      },
    })

    return NextResponse.json(usuarios)
  } catch (err) {
    console.error('[API ADMIN USUARIOS]', err)
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
  }
}
