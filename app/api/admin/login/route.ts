import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { compare } from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET ?? 'clave_super_secreta'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña obligatorios' }, { status: 400 })
    }

    const admin = await prisma.admin.findUnique({ where: { email } })

    if (!admin) {
      return NextResponse.json({ error: 'Administrador no encontrado' }, { status: 404 })
    }

    const isValid = await compare(password, admin.password)

    if (!isValid) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    // Crear el token
    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: '1d' })

    // Crear la respuesta
    const response = NextResponse.json({ message: 'Login correcto' })

    // Setear cookie segura
    response.cookies.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // solo true en Vercel o producción
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 día
    })

    return response
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
