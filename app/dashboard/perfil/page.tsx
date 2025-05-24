'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, Pencil, Save } from 'lucide-react'

type Perfil = {
  name: string
  email: string
  perks: number
  createdAt: string
}

export default function PerfilUsuario() {
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [nombreEditable, setNombreEditable] = useState<string>('')
  const [editando, setEditando] = useState(false)
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await fetch('/api/user/perfil')
        const data = await res.json()
        setPerfil(data)
        setNombreEditable(data.name)
      } catch (error) {
        console.error('Error al cargar el perfil', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPerfil()
  }, [])

  const handleToggleEditar = async () => {
    if (!editando) {
      setEditando(true)
      setErrorMsg(null)
    } else {
      setGuardando(true)
      setErrorMsg(null)

      try {
        const res = await fetch('/api/user/perfil', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: nombreEditable }),
        })

        const result = await res.json()

        if (!res.ok) {
          throw new Error(result.error || 'Error al actualizar el nombre')
        }

        if (perfil) {
          setPerfil({ ...perfil, name: result.user.name })
        }
        setEditando(false)
      } catch (error: any) {
        setErrorMsg(error.message || 'Error inesperado')
      } finally {
        setGuardando(false)
      }
    }
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
            <label className="block text-gray-700 font-medium mb-1">Nombre:</label>
            <input
              type="text"
              disabled={!editando}
              value={nombreEditable}
              onChange={(e) => setNombreEditable(e.target.value)}
              className={`w-full border px-3 py-1 rounded-md text-sm ${
                editando ? 'bg-white' : 'bg-gray-100 text-gray-500'
              }`}
            />
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

          {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleToggleEditar}
              disabled={guardando}
              className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-blue-700 transition flex items-center gap-1 disabled:opacity-50"
            >
              {editando ? <Save className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
              {editando ? (guardando ? 'Guardando...' : 'Guardar') : 'Modificar'}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-red-600">No se pudo cargar el perfil.</p>
      )}
    </div>
  )
}
