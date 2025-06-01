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

  useEffect(() => {
    fetch('/api/admin/perks')
      .then(res => res.json())
      .then(data => setPerks(data))
  }, [])

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

      {/* Modal para crear nuevo perk (por ahora vacío, lo completamos luego) */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear nuevo perk</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-500">Aquí irá el formulario de creación</p>

          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setModalAbierto(false)} className="px-4 py-1.5 text-sm">
              Cancelar
            </Button>
            <Button className="bg-blue-600 text-white ml-2 px-4 py-1.5 text-sm hover:bg-blue-700">
              Guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
