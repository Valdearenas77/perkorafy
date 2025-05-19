'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toaster'

interface ConfirmarCanjeDialogProps {
  perkId: number
  perkNombre: string
}

export default function ConfirmarCanjeDialog({ perkId, perkNombre }: ConfirmarCanjeDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleConfirm = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/canjear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ perkId })
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: '🎉 Canje exitoso',
        })
        setOpen(false)
      } else if (res.status === 403) {
        toast({
          title: '❌ Perks insuficientes',
          variant: 'destructive',
        })
      } else {
        toast({
          title: '⚠️ Error al canjear',
          description: data.error || 'No se pudo completar el canje.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error inesperado:', error)
      toast({
        title: '⚠️ Error inesperado',
        description: 'No se pudo procesar el canje.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-blue-700 transition"
      >
        Canjear
      </button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Confirmar canje?</DialogTitle>
        </DialogHeader>
        <p>¿Estás seguro de que deseas canjear el perk: <strong>{perkNombre}</strong>?</p>
        <DialogFooter className="mt-4">
          <button
            onClick={() => setOpen(false)}
            className="bg-gray-200 text-gray-800 text-sm px-4 py-1.5 rounded-md hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            Confirmar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>


  )
}
