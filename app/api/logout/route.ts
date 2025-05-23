// app/api/logout/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.redirect(
    new URL('/login', process.env.NEXT_PUBLIC_BASE_URL || 'https://app.perkorafy.com')
  );

  // Elimina la cookie llamada 'token'
  response.cookies.set({
    name: 'token',
    value: '',
    path: '/',
    expires: new Date(0),
  });

  return response;
}
