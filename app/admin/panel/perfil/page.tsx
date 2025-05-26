'use client'

import { useState, useEffect } from 'react'

export default function PerfilAdminPage() {
  const [admin, setAdmin] = useState({ nombre: '', email: '' })
  const [nuevaPassword, setNuevaPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Aquí podrías hacer fetch a un endpoint como /api/admin/me para obtener los datos reales
    setAdmin({ nombre: 'SuperAdmin', email: 'superadmin@perkorafy.com' }) // Simulado
  }, [])

  const handleGuardar = async () => {
    setLoading(true)
    // Aquí deberías enviar la nueva contraseña si existe
    console.log('Guardar cambios:', nuevaPassword)
    setLoading(false)
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Mi perfil</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <input
          type="text"
          value={admin.nombre}
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
