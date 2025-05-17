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
  perkNombre: string
  onConfirm: () => void
}

export function ConfirmarCanjeDialog({ perkNombre, onConfirm }: Props) {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    onConfirm()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      <Button className="text-sm bg-green-600 hover:bg-green-700 text-white">Canjear</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Confirmar canje?</DialogTitle>
        </DialogHeader>
        <p>¿Seguro que quieres canjear el beneficio "<strong>{perkNombre}</strong>"?</p>
        <DialogFooter className="mt-4">
<Button
  onClick={() => setOpen(false)}
  className="bg-gray-200 hover:bg-gray-300 text-black"
>
  Cancelar
</Button>

          <Button onClick={handleConfirm}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
