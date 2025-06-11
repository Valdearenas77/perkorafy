import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function generarTokenRecuperacion(userId: number) {
  const token = crypto.randomBytes(32).toString('hex')
  const expiracion = new Date(Date.now() + 1000 * 60 * 60 * 24) // 24 horas de validez

  await prisma.PasswordRecovery.create({
    data: {
      usuarioId: userId,
      token,
      expiracion
    }
  })

  return token
}
