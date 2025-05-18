"use client"

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
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
        toast({ title: '🎉 Canje exitoso' })
        setOpen(false)
      } else {
        toast({
          title: '⚠️ Error al canjear',
          description: data.error || 'No se pudo completar el canje.',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: '⚠️ Error inesperado',
        description: 'No se pudo procesar el canje.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="default">
        Canjear
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Confirmar canje?</DialogTitle>
          </DialogHeader>
          <p>¿Estás seguro de que deseas canjear el perk: <strong>{perkNombre}</strong>?</p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm} disabled={loading}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}




