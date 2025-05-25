// app/api/admin/login/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET ?? 'clave_super_secreta'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email, password } = body

  if (!email || !password) {
    return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 })
  }

  const admin = await prisma.admin.findUnique({ where: { email } })
  if (!admin) {
    return NextResponse.json({ error: 'Administrador no encontrado' }, { status: 404 })
  }

  const validPassword = await compare(password, admin.password)
  if (!validPassword) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
  }

  const token = jwt.sign({ adminId: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: '1d' })

  const response = NextResponse.json({ message: 'Login correcto' })
  response.cookies.set('adminToken', token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24, // 1 día
  })

  return response
}
