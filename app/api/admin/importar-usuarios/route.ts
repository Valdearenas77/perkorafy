import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generarTokenRecuperacion } from '@/lib/tokens'  // esta función ya la tenemos implementada
import { enviarEmailRecuperacion } from '@/lib/emails'    // suponemos que existe o lo crearemos luego

type UsuarioImportado = {
  name: string
  email: string
  perks: number
}

export async function POST(req: NextRequest) {
  try {
    const adminToken = req.headers.get('authorization')

    // Aquí iría tu validación de token de admin. Simplificado para este ejemplo.
    if (!adminToken || adminToken !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const usuarios: UsuarioImportado[] = await req.json()

    const resultados: { email: string; status: string }[] = []

    for (const u of usuarios) {
      const existe = await prisma.user.findUnique({
        where: { email: u.email }
      })

      if (existe) {
        resultados.push({ email: u.email, status: 'ya existe' })
        continue
      }

      const nuevoUsuario = await prisma.user.create({
        data: {
          name: u.name,
          email: u.email,
          perks: u.perks || 0,
          password: '',  // sin contraseña inicial
        }
      })

      const token = await generarTokenRecuperacion(nuevoUsuario.id)

      // (opcional: activar esto cuando tengamos el email listo)
      // await enviarEmailRecuperacion(nuevoUsuario.email, token)

      resultados.push({ email: u.email, status: 'creado' })
    }

    return NextResponse.json({ resultados })
  } catch (error) {
    console.error('Error al importar usuarios:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
