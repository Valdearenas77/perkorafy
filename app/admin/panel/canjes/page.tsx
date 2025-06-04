'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
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
  const [total, setTotal] = useState(0)
  const [skip, setSkip] = useState(0)
  const [loading, setLoading] = useState(false)

  const [filtros, setFiltros] = useState({
    usuario: '',
    estado: '',
    fechaInicio: '',
    fechaFin: '',
  })

  const limit = 100

  const fetchCanjes = async (append = false) => {
    setLoading(true)

    const params = new URLSearchParams()
    if (filtros.usuario) params.append('usuario', filtros.usuario)
    if (filtros.estado) params.append('estado', filtros.estado)
    if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio)
    if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin)
    params.append('skip', skip.toString())
    params.append('limit', limit.toString())

    const res = await fetch(`/api/admin/canjes?${params.toString()}`, {
      cache: 'no-store',
    })

    const data = await res.json()
    setCanjes((prev) => (append ? [...prev, ...data.canjes] : data.canjes))
    setTotal(data.total)
    setLoading(false)
  }

  useEffect(() => {
    setSkip(0)
    fetchCanjes(false)
  }, [filtros])

  const cargarMas = () => {
    const nuevoSkip = skip + limit
    setSkip(nuevoSkip)
    fetchCanjes(true)
  }

  const actualizarEstado = async (id: number, nuevoEstado: string) => {
    try {
      const res = await fetch(`/api/admin/canjes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      })

      if (res.ok) {
        const actualizado = await res.json()
        setCanjes((prev) =>
          prev.map((canje) =>
            canje.id === actualizado.id
              ? { ...canje, estado: actualizado.estado }
              : canje
          )
        )
        toast.success(`Canje ${actualizado.estado}`)
      } else {
        toast.error('Error al actualizar el estado')
      }
    } catch {
      toast.error('Error de conexión con el servidor')
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Gestión de Canjes</h1>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Input
          placeholder="Buscar usuario"
          value={filtros.usuario}
          onChange={(e) => setFiltros({ ...filtros, usuario: e.target.value })}
        />
        <Select value={filtros.estado} onValueChange={(estado) => setFiltros({ ...filtros, estado })}>
          <SelectTrigger>
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="pendiente">Pendiente</SelectItem>
            <SelectItem value="aprobado">Aprobado</SelectItem>
            <SelectItem value="rechazado">Rechazado</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={filtros.fechaInicio}
          onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })}
        />
        <Input
          type="date"
          value={filtros.fechaFin}
          onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })}
        />
        <Button onClick={() => fetchCanjes(false)} disabled={loading}>
          Buscar
        </Button>
      </div>

      {/* Tabla de canjes */}
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

      {/* Botón cargar más */}
      {canjes.length < total && (
        <div className="text-center mt-4">
          <Button onClick={cargarMas} disabled={loading}>
            {loading ? 'Cargando...' : 'Cargar más'}
          </Button>
        </div>
      )}
    </div>
  )
}

