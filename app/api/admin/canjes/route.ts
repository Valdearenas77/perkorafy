import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const estado = searchParams.get("estado") || undefined
    const usuario = searchParams.get("usuario") || undefined
    const fechaInicio = searchParams.get("fechaInicio") || undefined
    const fechaFin = searchParams.get("fechaFin") || undefined
    const skip = parseInt(searchParams.get("skip") || "0")
    const limit = parseInt(searchParams.get("limit") || "100")

    const where: any = {}

    if (estado) {
      where.estado = estado
    }

    if (usuario) {
      where.usuario = {
        OR: [
          { name: { contains: usuario, mode: "insensitive" } },
          { email: { contains: usuario, mode: "insensitive" } },
        ],
      }
    }

    if (fechaInicio || fechaFin) {
      where.fecha = {}
      if (fechaInicio) where.fecha.gte = new Date(fechaInicio)
      if (fechaFin) where.fecha.lte = new Date(fechaFin)
    }

    const [canjes, total] = await Promise.all([
      prisma.canje.findMany({
        where,
        orderBy: { fecha: 'desc' },
        skip,
        take: limit,
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
      }),
      prisma.canje.count({ where }),
    ])

    return new NextResponse(JSON.stringify({ total, canjes }), {
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

