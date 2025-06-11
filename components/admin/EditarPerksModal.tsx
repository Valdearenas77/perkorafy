'use client'

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

  // Manejar escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscape)
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [open, onClose])

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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!open) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {usuario ? `Editar perks de ${usuario.name}` : 'Editar perks'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
            disabled={cargando}
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Cantidad de perks</label>
            <input
              type="number"
              min={0}
              value={nuevoPerk}
              onChange={(e) => setNuevoPerk(parseInt(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={cargando}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-300 text-black rounded-md hover:bg-gray-400 transition disabled:opacity-50"
              disabled={cargando}
            >
              Cancelar
            </button>
            <button
              onClick={handleGuardar}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              disabled={cargando || !usuario}
            >
              {cargando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


