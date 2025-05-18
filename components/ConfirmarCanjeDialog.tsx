'use client'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

type Props = {
  perkId: number
  perkNombre: string
}

export function ConfirmarCanjeDialog({ perkId, perkNombre }: Props) {
  const [open, setOpen] = useState(false)

  const handleConfirm = async () => {
    try {
      const res = await fetch('/api/canjear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ perkId }),
      })

      const data = await res.json()

      if (res.ok) {
        alert(`🎉 ${data.message}`)
      } else {
        alert(`❌ ${data.error}`)
      }

      setOpen(false)
    } catch (err) {
      console.error('Error al canjear:', err)
      alert('❌ Error inesperado al procesar el canje')
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-sm bg-green-600 hover:bg-green-700 text-white">
          Canjear
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Confirmar canje?</DialogTitle>
        </DialogHeader>
        <p>¿Seguro que quieres canjear el beneficio <strong>{perkNombre}</strong>?</p>
        <DialogFooter className="mt-4">
          <Button
            onClick={() => setOpen(false)}
            className="bg-gray-200 hover:bg-gray-300 text-black"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
