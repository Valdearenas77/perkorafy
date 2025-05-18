"use client"

import { useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toaster"

export default function ConfirmarCanjeDialog({
  perkId,
  perkNombre,
}: {
  perkId: number
  perkNombre: string
}) {
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
           title: `🎉 Canje exitoso: ${data.message}`
        })

        setOpen(false)
      } else {
        toast({
          title: `❌ Error al canjear: ${data.error}`,
          variant: "destructive",
        })

      }
    } catch (error) {
      toast({
         title: "⚠️ Error inesperado: No se pudo procesar el canje.",
         variant: "destructive",
        })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-sm">Canjear</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Confirmar canje?</DialogTitle>
        </DialogHeader>
        <p>
          ¿Seguro que quieres canjear el beneficio <strong>{perkNombre}</strong>?
        </p>
        <DialogFooter className="mt-4 flex flex-row justify-end gap-2">
  <Button
    className="bg-red-600 hover:bg-red-700 text-white"
    onClick={() => setOpen(false)}
  >
    Cancelar
  </Button>

  <Button
    className="bg-blue-600 hover:bg-blue-700 text-white"
    onClick={async () => {
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
            variant: "default",
          })
          setOpen(false)
        } else {
          toast({
            title: "⚠️ No se pudo canjear",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "⚠️ Error inesperado",
          variant: "destructive",
        })
      }
    }}
  >
    Confirmar
  </Button>
</DialogFooter>

      </DialogContent>
    </Dialog>
  )
}
