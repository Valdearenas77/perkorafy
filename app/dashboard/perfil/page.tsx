'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Perfil = {
  name: string
  email: string
  perks: number
  createdAt: string
}

export default function PerfilUsuario() {
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await fetch('/api/user/perks')
        const data = await res.json()
        setPerfil(data)
      } catch (error) {
        console.error('Error al cargar el perfil', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPerfil()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <button
        onClick={() => window.history.back()}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </button>

      <h1 className="text-2xl font-bold mb-6 text-center">Perfil de usuario</h1>

      {loading ? (
        <p className="text-center text-gray-500">Cargando perfil...</p>
      ) : perfil ? (
        <div className="border rounded-md p-6 shadow-sm space-y-4 text-sm text-gray-800 bg-white">
          <div>
            <span className="font-medium text-gray-700">Nombre:</span> {perfil.name}
          </div>
          <div>
            <span className="font-medium text-gray-700">Correo electrónico:</span> {perfil.email}
          </div>
          <div>
            <span className="font-medium text-gray-700">Perks disponibles:</span> {perfil.perks}
          </div>
          <div>
            <span className="font-medium text-gray-700">Fecha de alta:</span>{' '}
            {new Date(perfil.createdAt).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleLogout}
              className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-blue-700 transition flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-red-600">No se pudo cargar el perfil.</p>
      )}
    </div>
  )
}
