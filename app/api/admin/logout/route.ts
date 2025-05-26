import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ message: 'Sesión cerrada' })

  response.cookies.set('adminToken', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  })

  return response
}
