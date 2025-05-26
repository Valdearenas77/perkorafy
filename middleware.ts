import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const isProtected = req.nextUrl.pathname.startsWith('/admin/panel')

  if (isProtected) {
    const token = req.cookies.get('adminToken')?.value

    if (!token) {
      console.warn('[MIDDLEWARE] Sin token → Redirigiendo a login')
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/panel/:path*'],
}

// forzar redeploy
