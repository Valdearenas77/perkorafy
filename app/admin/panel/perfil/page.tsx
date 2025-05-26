'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export default function PerfilAdminPage() {
  const [admin, setAdmin] = useState<{ name: string; email: string } | null>(null)
  const [nuevaPassword, setNuevaPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const res = await fetch('/api/admin/me')
        const data = await res.json()
        if (res.ok) {
          setAdmin(data)
        } else {
          toast.error(data.error || 'No se pudo cargar el perfil')
        }
      } catch (error) {
        toast.error('Error al conectar con el servidor')
      }
    }

    cargarPerfil()
  }, [])

  const handleGuardar = async () => {
    if (!nuevaPassword.trim()) {
      toast.info('No se realizaron cambios')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: nuevaPassword }),
      })

      const data = await res.json()
      if (res.ok) {
        toast.success('Contraseña actualizada correctamente')
        setNuevaPassword('')
      } else {
        toast.error(data.error || 'No se pudo actualizar la contraseña')
      }
    } catch {
      toast.error('Error al actualizar contraseña')
    } finally {
      setLoading(false)
    }
  }

  if (!admin) return <p className="text-center mt-10">Cargando perfil...</p>

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Mi perfil</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <input
          type="text"
          value={admin.name}
          disabled
          className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
        <input
          type="email"
          value={admin.email}
          disabled
          className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
        <input
          type="password"
          value={nuevaPassword}
          onChange={(e) => setNuevaPassword(e.target.value)}
          placeholder="Dejar en blanco para no cambiar"
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <button
        onClick={handleGuardar}
        disabled={loading}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </div>
  )
}
