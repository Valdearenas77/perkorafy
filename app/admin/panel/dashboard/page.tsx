'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    await fetch('/api/admin/logout', { method: 'POST' })
    toast.success('Sesión cerrada')
    window.location.href = '/admin/login'
  }

  return (
    <div className="text-center">
      <h1 className="text-2xl font-semibold mb-2">Bienvenido al panel de administración</h1>
      <p className="text-gray-600 mb-4">Desde aquí puedes gestionar usuarios, perks y canjes.</p>

      <button
        onClick={handleLogout}
        disabled={loading}
        className="bg-red-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-red-700 transition disabled:opacity-50"
      >
        {loading ? 'Cerrando sesión...' : 'Cerrar sesión'}
      </button>
    </div>
  )
}
