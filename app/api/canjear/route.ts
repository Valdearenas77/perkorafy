import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verify } from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET ?? 'clave_super_secreta'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { perkId } = body

    console.log('🟢 Llamada recibida en /api/canjear')
    console.log('🔢 perkId:', perkId)

    if (!perkId) {
      return NextResponse.json({ error: 'ID del perk no proporcionado' }, { status: 400 })
    }

    const token = cookies().get('token')?.value
    console.log('🍪 token:', token)
    if (!token) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const decoded = verify(token, JWT_SECRET) as { userId: number }
    console.log('🧠 decoded:', decoded)
    const userId = decoded.userId

    const user = await prisma.user.findUnique({ where: { id: userId } })
    console.log('👤 user:', user)
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const perk = await prisma.perk.findUnique({ where: { id: perkId } })
    console.log('🎁 perk:', perk)
    if (!perk) {
      return NextResponse.json({ error: 'Perk no encontrado' }, { status: 404 })
    }

    if ((user.perks ?? 0) < perk.puntos) {
      return NextResponse.json({ error: 'Puntos insuficientes' }, { status: 403 })
    }

    await prisma.$transaction([
      prisma.canje.create({
        data: {
          usuarioId: user.id,
          perkId: perk.id,
          estado: 'pendiente',
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { perks: user.perks - perk.puntos },
      }),
    ])

    return NextResponse.json({ message: 'Canje registrado con éxito' }, { status: 200 })
  } catch (error) {
    console.error('Error al procesar el canje:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
