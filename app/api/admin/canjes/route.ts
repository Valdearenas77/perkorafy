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

    return new NextResponse(JSON.stringify(canjes), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Error al obtener canjes:', error)
    return NextResponse.json({ error: 'Error al obtener canjes' }, { status: 500 })
  }
}
