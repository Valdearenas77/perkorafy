import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET ?? 'clave_super_secreta'

export function middleware(req: NextRequest) {
  const isProtected = req.nextUrl.pathname.startsWith('/admin/panel')

  if (isProtected) {
    const token = req.cookies.get('adminToken')?.value

    console.log('[MIDDLEWARE] Ruta protegida:', req.nextUrl.pathname)
    console.log('[MIDDLEWARE] Token recibido:', token ?? 'SIN TOKEN')
    console.log('[MIDDLEWARE] JWT_SECRET activo:', JWT_SECRET ? 'sí' : 'NO DEFINIDO')

    if (!token) {
      console.warn('[MIDDLEWARE] No hay token → Redirigiendo a login')
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      console.log('[MIDDLEWARE] Token válido:', decoded)
      return NextResponse.next()
    } catch (err) {
      console.error('[MIDDLEWARE] Error al verificar token:', err)
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/panel/:path*'],
}
