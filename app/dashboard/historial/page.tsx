'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'

type Canje = {
  id: number
  fecha: string
  estado: string
  perk: {
    nombre: string
    puntos: number
  }
}

export default function Historial() {
  const [canjes, setCanjes] = useState<Canje[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCanjes = async () => {
      try {
        const res = await fetch('/api/canjes')
        const data = await res.json()
        setCanjes(data)
      } catch (error) {
        console.error('Error al cargar historial')
      } finally {
        setLoading(false)
      }
    }

    fetchCanjes()
  }, [])

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => window.history.back()}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </button>

      <h1 className="text-2xl font-bold mb-4 text-center">Historial de canjes</h1>

      {loading ? (
        <p className="text-center text-gray-500">Cargando historial...</p>
      ) : canjes.length === 0 ? (
        <p className="text-center text-gray-500">Aún no has canjeado ningún beneficio.</p>
      ) : (
        <ul className="space-y-4">
          {canjes.map((canje) => (
            <li
              key={canje.id}
              className="border rounded-md p-4 shadow-sm flex justify-between items-start"
            >
              <div>
                <p className="text-sm text-gray-600">
                  {new Date(canje.fecha).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <h2 className="font-semibold">{canje.perk.nombre}</h2>
                <p className="text-sm text-gray-700">
                  Coste: {canje.perk.puntos} perks
                </p>
              </div>
              <span className="text-sm px-2 py-1 bg-gray-100 rounded-md text-gray-700 capitalize">
                {canje.estado}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
