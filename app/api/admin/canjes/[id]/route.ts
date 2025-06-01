import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id)

  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    const { estado } = await req.json()

    if (!['pendiente', 'aprobado', 'rechazado'].includes(estado)) {
      return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
    }

    const updated = await prisma.canje.update({
      where: { id },
      data: { estado },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error al actualizar estado del canje:', error)
    return NextResponse.json({ error: 'Error al actualizar el canje' }, { status: 500 })
  }
}
