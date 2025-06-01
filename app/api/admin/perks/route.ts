import { NextRequest, NextResponse } from 'next/server'
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nombre, descripcion, puntos } = body

    if (!nombre || !descripcion || typeof puntos !== 'number' || puntos < 0) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }

    const nuevoPerk = await prisma.perk.create({
      data: {
        nombre,
        descripcion,
        puntos
      }
    })

    return NextResponse.json(nuevoPerk)
  } catch (error) {
    console.error('Error al crear perk:', error)
    return NextResponse.json({ error: 'Error al crear perk' }, { status: 500 })
  }
}
