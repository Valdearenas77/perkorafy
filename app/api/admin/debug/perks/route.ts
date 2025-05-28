import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const suma = await prisma.user.aggregate({
    _sum: { perks: true }
  })

  const users = await prisma.user.findMany({
    select: { id: true, name: true, perks: true }
  })

  return NextResponse.json({ suma, users })
}
