'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'

type Perk = {
  id: number
  nombre: string
  descripcion: string
  puntos: number
}

export default function PerksPage() {
  const [perks, setPerks] = useState<Perk[]>([])
  const [modalAbierto, setModalAbierto] = useState(false)

  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [puntos, setPuntos] = useState(0)

  const [modoEdicion, setModoEdicion] = useState(false)
  const [perkEditando, setPerkEditando] = useState<Perk | null>(null)

  const [perkAEliminar, setPerkAEliminar] = useState<Perk | null>(null)
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false)

  useEffect(() => {
    fetch('/api/admin/perks')
      .then(res => res.json())
      .then(data => setPerks(data))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = { nombre, descripcion, puntos }

    const url = modoEdicion
      ? `/api/admin/perks/${perkEditando?.id}`
      : '/api/admin/perks'

    const method = modoEdicion ? 'PATCH' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const actualizado = await res.json()

        if (modoEdicion) {
          setPerks((prev) =>
            prev.map((p) => (p.id === actualizado.id ? actualizado : p))
          )
          toast.success('Perk actualizado correctamente')
        } else {
          setPerks((prev) => [...prev, actualizado])
          toast.success('Perk creado correctamente')
        }

        setModalAbierto(false)
        setModoEdicion(false)
        setPerkEditando(null)
        setNombre('')
        setDescripcion('')
        setPuntos(0)
      } else {
        const data = await res.json()
        toast.error(data.error || 'Error al guardar')
      }
    } catch {
      toast.error('Error de conexión con el servidor')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Catálogo de Perks</h1>
        <Button
          onClick={() => {
            setModalAbierto(true)
            setModoEdicion(false)
            setNombre('')
            setDescripcion('')
            setPuntos(0)
          }}
          className="bg-blue-600 text-white hover:bg-blue-700 px-5 py-2 text-sm rounded-md"
        >
          Crear perk
        </Button>
      </div>

      <table className="w-full bg-white shadow rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-2">Nombre</th>
            <th className="text-left px-4 py-2">Descripción</th>
            <th className="text-left px-4 py-2">Puntos</th>
            <th className="text-left px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {perks.map((perk) => (
            <tr key={perk.id} className="border-t">
              <td className="px-4 py-2">{perk.nombre}</td>
              <td className="px-4 py-2">{perk.descripcion}</td>
              <td className="px-4 py-2">{perk.puntos}</td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <Button
                    className="px-3 py-1 text-sm"
                    onClick={() => {
                      setModoEdicion(true)
                      setPerkEditando(perk)
                      setNombre(perk.nombre)
                      setDescripcion(perk.descripcion)
                      setPuntos(perk.puntos)
                      setModalAbierto(true)
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    className="px-3 py-1 text-sm"
                    onClick={() => {
                      setPerkAEliminar(perk)
                      setConfirmarEliminacion(true)
                    }}
                  >
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Crear/Editar */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modoEdicion ? 'Editar perk' : 'Crear nuevo perk'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Puntos necesarios</label>
              <input
                type="number"
                value={puntos}
                onChange={(e) => setPuntos(Number(e.target.value))}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setModalAbierto(false)
                  setModoEdicion(false)
                }}
                className="px-5 py-1.5 text-sm rounded-md"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700 px-5 py-1.5 text-sm rounded-md"
              >
                Guardar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Confirmación Eliminación */}
      <Dialog open={confirmarEliminacion} onOpenChange={setConfirmarEliminacion}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar perk</DialogTitle>
          </DialogHeader>

          <p className="text-sm">
            ¿Estás seguro de que deseas eliminar el perk{' '}
            <strong>{perkAEliminar?.nombre}</strong>?
          </p>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmarEliminacion(false)}
              className="px-5 py-1.5 text-sm"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              className="px-5 py-1.5 text-sm"
              onClick={async () => {
                if (!perkAEliminar) return
                try {
                  const res = await fetch(`/api/admin/perks/${perkAEliminar.id}`, {
                    method: 'DELETE',
                  })

                  if (res.ok) {
                    toast.success('Perk eliminado correctamente')
                    setPerks((prev) =>
                      prev.filter((p) => p.id !== perkAEliminar.id)
                    )
                    setConfirmarEliminacion(false)
                    setPerkAEliminar(null)
                  } else {
                    const data = await res.json()
                    toast.error(data.error || 'Error al eliminar')
                  }
                } catch {
                  toast.error('Error de conexión con el servidor')
                }
              }}
            >
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
