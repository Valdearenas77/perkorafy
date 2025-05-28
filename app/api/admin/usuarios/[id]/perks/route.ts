import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = parseInt(params.id)
  if (isNaN(userId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    const body = await req.json()
    const { perks } = body

    if (typeof perks !== 'number' || perks < 0) {
      return NextResponse.json({ error: 'Valor de perks inválido' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    await prisma.user.update({
      where: { id: userId },
      data: { perks }
    })

    return NextResponse.json({ message: 'Perks actualizados correctamente' })
  } catch (error) {
    console.error('Error actualizando perks:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
