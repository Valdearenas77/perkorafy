import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id)

  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    const perk = await prisma.perk.findUnique({ where: { id } })

    if (!perk) {
      return NextResponse.json({ error: 'Perk no encontrado' }, { status: 404 })
    }

    await prisma.perk.delete({ where: { id } })

    return NextResponse.json({ message: 'Perk eliminado correctamente' })
  } catch (error) {
    console.error('Error al eliminar perk:', error)
    return NextResponse.json({ error: 'Error al eliminar perk' }, { status: 500 })
  }
}
