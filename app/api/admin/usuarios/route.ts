import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET ?? 'clave_super_secreta'

// GET: Listar usuarios
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

// POST: Crear nuevo usuario
export async function POST(req: NextRequest) {
  const token = req.cookies.get('adminToken')?.value

  if (!token) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  try {
    jwt.verify(token, JWT_SECRET)

    const body = await req.json()
    const { name, email, perks } = body

    if (!name || !email || perks === undefined) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email no válido' }, { status: 400 })
    }

    const nuevoUsuario = await prisma.user.create({
      data: {
        name,
        email,
        perks: parseInt(perks, 10),
      },
      select: {
        id: true,
        name: true,
        email: true,
        perks: true,
      },
    })

    return NextResponse.json(nuevoUsuario, { status: 201 })
  } catch (err) {
    console.error('[API ADMIN USUARIOS POST]', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
