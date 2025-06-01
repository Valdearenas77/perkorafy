import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const perks = await prisma.perk.findMany({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        puntos: true
      }
    })

    return NextResponse.json(perks)
  } catch (error) {
    console.error('Error al obtener perks:', error)
    return NextResponse.json({ error: 'Error al obtener perks' }, { status: 500 })
  }
}
