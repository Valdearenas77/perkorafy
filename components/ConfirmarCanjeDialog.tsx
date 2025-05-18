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
import { useToast } from "@/components/ui/toast"

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
          title: "🎉 Canje exitoso",
          description: data.message,
        })
        setOpen(false)
      } else {
        toast({
          title: "❌ Error al canjear",
          description: data.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "⚠️ Error inesperado",
        description: "No se pudo procesar el canje.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open
