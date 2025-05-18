"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toaster"

interface ConfirmarCanjeDialogProps {
  perkId: number
  perkNombre: string
}

export default function ConfirmarCanjeDialog({ perkId, perkNombre }: ConfirmarCanjeDialogProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const handleConfirm = async () => {
    try {
      const res = await fetch("/api/canjear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ perkId }),
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: "🎉 Canje exitoso",
        })
        setOpen(false)
      } else {
        toast({
          title: "⚠️ Error al canjear",
          description: data.error || "No se pudo completar el canje.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "❌ Error inesperado",
        description: "Inténtalo más tarde.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
          Canjear
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar canje</DialogTitle>
          <DialogDescription>
            ¿Seguro que quieres canjear el beneficio <strong>{perkNombre}</strong>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 flex flex-row justify-end gap-2">
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleConfirm}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
