'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type EditarPerksModalProps = {
  open: boolean
  onClose: () => void
  usuario: { id: number; name: string; perks: number } | null
  refresh: () => void
}

export function EditarPerksModal({
  open,
  onClose,
  usuario,
  refresh,
}: EditarPerksModalProps) {
  const [nuevoPerk, setNuevoPerk] = useState(0)
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    if (open && usuario) {
      setNuevoPerk(usuario.perks)
    }
  }, [open, usuario])

  const handleGuardar = async () => {
    if (!usuario) return

    setCargando(true)
    try {
      const res = await fetch(`/api/admin/usuarios/${usuario.id}/perks`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ perks: nuevoPerk }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success('Perks actualizados correctamente')
        onClose()
        refresh()
      } else {
        toast.error(data.error || 'Error al actualizar los perks')
      }
    } catch (error) {
      toast.error('Error de red o del servidor')
      console.error(error)
    } finally {
      setCargando(false)
    }
  }

  if (!open || !usuario) return null

  return (
    <Dialog open={open} onOpenChange={(estadoAbierto) => {
      if (!estadoAbierto) onClose()
    }}>
      <DialogContent key={usuario.id} className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar perks de {usuario.name}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block mb-1 font-medium">Cantidad de perks</label>
            <input
              type="number"
              min={0}
              value={nuevoPerk}
              onChange={(e) => setNuevoPerk(parseInt(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-3 py-1 text-sm bg-gray-300 text-black rounded-md hover:bg-gray-400 transition"
              disabled={cargando}
            >
              Cancelar
            </button>
            <button
              onClick={handleGuardar}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              disabled={cargando}
            >
              Guardar
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
