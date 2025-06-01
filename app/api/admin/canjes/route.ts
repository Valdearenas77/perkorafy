import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const canjes = await prisma.canje.findMany({
      orderBy: { fecha: 'desc' },
      select: {
        id: true,
        fecha: true,
        estado: true,
        usuario: {
          select: { name: true },
        },
        perk: {
          select: { nombre: true },
        },
      },
    })

    return NextResponse.json(canjes)
  } catch (error) {
    console.error('Error al obtener canjes:', error)
    return NextResponse.json({ error: 'Error al obtener canjes' }, { status: 500 })
  }
}
