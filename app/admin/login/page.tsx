'use client'

import { useState } from 'react'
import { toast } from 'sonner'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      toast.success('Bienvenido, administrador')
      setTimeout(() => {
                        window.location.href = '/admin/panel/dashboard'
                       }, 300)

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
          disabled={loading}
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="mb-4 w-full rounded border px-3 py-2"
          disabled={loading}
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Accediendo...' : 'Iniciar sesión'}
        </button>
      </div>
    </div>
  )
}
