'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type EditarPerksModalProps = {
  open: boolean
  onClose: () => void
  usuario: { id: number; name: string; perks: number }
  refresh: () => void
}

export function EditarPerksModal({ open, onClose, usuario, refresh }: EditarPerksModalProps) {
  const [nuevoPerk, setNuevoPerk] = useState(usuario.perks)
  const [cargando, setCargando] = useState(false)

  // 🔁 Reinicia el estado cada vez que se abre el modal o cambia de usuario
  useEffect(() => {
    if (open) {
      setNuevoPerk(usuario.perks)
    }
  }, [open, usuario])

  const handleGuardar = async () => {
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
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
              onChange={(e) => setNuevoPerk(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setNuevoPerk(usuario.perks) // restaura valor original
                onClose()
              }}
              className="bg-gray-300 text-black text-sm px-4 py-1.5 rounded-md hover:bg-gray-400 transition"
              disabled={cargando}
            >
              Cancelar
            </button>
            <button
              onClick={handleGuardar}
              className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-blue-700 transition"
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
