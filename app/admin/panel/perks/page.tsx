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

  useEffect(() => {
    fetch('/api/admin/perks')
      .then(res => res.json())
      .then(data => setPerks(data))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch('/api/admin/perks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, descripcion, puntos }),
      })

      if (res.ok) {
        const nuevo = await res.json()
        setPerks((prev) => [...prev, nuevo])
        toast.success('Perk creado correctamente')
        setModalAbierto(false)
        setNombre('')
        setDescripcion('')
        setPuntos(0)
      } else {
        const data = await res.json()
        toast.error(data.error || 'Error al crear el perk')
      }
    } catch {
      toast.error('Error de conexión con el servidor')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Catálogo de Perks</h1>
        <Button onClick={() => setModalAbierto(true)} className="bg-blue-600 text-white hover:bg-blue-700">
          Nuevo perk
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
                  <Button className="px-3 py-1 text-sm">Editar</Button>
                  <Button variant="destructive" className="px-3 py-1 text-sm">Eliminar</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear nuevo perk</DialogTitle>
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
              <Button type="button" variant="outline" onClick={() => setModalAbierto(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                Guardar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
