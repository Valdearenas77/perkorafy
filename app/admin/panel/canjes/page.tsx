'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type Canje = {
  id: number
  fecha: string
  estado: string
  usuario: { name: string }
  perk: { nombre: string }
}

export default function CanjesPage() {
  const [canjes, setCanjes] = useState<Canje[]>([])

const pathname = usePathname()

useEffect(() => {
  fetch('/api/admin/canjes')
    .then(res => res.json())
    .then(data => setCanjes(data))
}, [pathname])

  const actualizarEstado = async (id: number, nuevoEstado: string) => {
    try {
      const res = await fetch(`/api/admin/canjes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      })

      if (res.ok) {
        setCanjes((prev) =>
          prev.map((c) => (c.id === id ? { ...c, estado: nuevoEstado } : c))
        )
        toast.success(`Canje ${nuevoEstado}`)
      } else {
        toast.error('Error al actualizar el estado')
      }
    } catch {
      toast.error('Error de conexión con el servidor')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Gestión de Canjes</h1>

      <table className="w-full bg-white shadow rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-2">Usuario</th>
            <th className="text-left px-4 py-2">Perk</th>
            <th className="text-left px-4 py-2">Fecha</th>
            <th className="text-left px-4 py-2">Estado</th>
            <th className="text-left px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {canjes.map((canje) => (
            <tr key={canje.id} className="border-t">
              <td className="px-4 py-2">{canje.usuario.name}</td>
              <td className="px-4 py-2">{canje.perk.nombre}</td>
              <td className="px-4 py-2">{new Date(canje.fecha).toLocaleDateString()}</td>
              <td className="px-4 py-2 capitalize">{canje.estado}</td>
              <td className="px-4 py-2">
                {canje.estado === 'pendiente' ? (
                  <div className="flex gap-2">
                    <Button
                      className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => actualizarEstado(canje.id, 'aprobado')}
                    >
                      Aprobar
                    </Button>
                    <Button
                      className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => actualizarEstado(canje.id, 'rechazado')}
                    >
                      Rechazar
                    </Button>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
