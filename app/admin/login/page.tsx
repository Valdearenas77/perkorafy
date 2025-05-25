'use client'

import { useState } from 'react'
import { toast } from 'sonner'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    })

    const data = await res.json()
    if (res.ok) {
      toast.success('Bienvenido, administrador')
      // Forzar recarga completa para que se aplique el layout del grupo (panel)
      window.location.href = '/admin/(panel)/dashboard'
    } else {
      toast.error(data.error || 'Error al iniciar sesión')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-center text-xl font-semibold">Login Administrador</h2>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Correo"
          className="mb-3 w-full rounded border px-3 py-2"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="mb-4 w-full rounded border px-3 py-2"
        />
        <button
          onClick={handleLogin}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  )
}
