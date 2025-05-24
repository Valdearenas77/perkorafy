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
  const [filtroDesde, setFiltroDesde] = useState<string>('')
  const [filtroHasta, setFiltroHasta] = useState<string>('')
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

  // Aplicar filtro por fecha
  const canjesFiltrados = canjes.filter((canje) => {
    const fecha = new Date(canje.fecha)
    const desde = filtroDesde ? new Date(filtroDesde) : null
    const hasta = filtroHasta ? new Date(filtroHasta) : null

    if (desde && fecha < desde) return false
    if (hasta && fecha > hasta) return false
    return true
  })

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

      {/* Filtros por fecha */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 justify-center">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Desde:</label>
          <input
            type="date"
            value={filtroDesde}
            onChange={(e) => setFiltroDesde(e.target.value)}
            className="border rounded-md px-2 py-1 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Hasta:</label>
          <input
            type="date"
            value={filtroHasta}
            onChange={(e) => setFiltroHasta(e.target.value)}
            className="border rounded-md px-2 py-1 text-sm"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Cargando historial...</p>
      ) : canjesFiltrados.length === 0 ? (
        <p className="text-center text-gray-500">No hay canjes en este rango de fechas.</p>
      ) : (
        <ul className="space-y-4">
          {canjesFiltrados.map((canje) => (
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
