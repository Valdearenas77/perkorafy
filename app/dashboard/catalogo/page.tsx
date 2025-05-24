'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

type Perk = {
  id: string
  nombre: string
  descripcion: string
  puntos: number
}

export default function Catalogo() {
  const [perks, setPerks] = useState<Perk[]>([])
  const [selectedPerk, setSelectedPerk] = useState<Perk | null>(null)
  const [userPerks, setUserPerks] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const fetchPerks = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/perks')
      const data = await res.json()
      setPerks(data)
    } catch (error) {
      toast.error('No se pudieron cargar los perks')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserPerks = async () => {
    try {
      const res = await fetch('/api/user/perks')
      const data = await res.json()
      setUserPerks(data.perks)
    } catch (error) {
      console.error("Error al obtener perks del usuario")
    }
  }

  useEffect(() => {
    fetchPerks()
    fetchUserPerks()
  }, [])

  const handleCanjear = (perk: Perk) => {
    setSelectedPerk(perk)
    setErrorMsg("")
    setDialogOpen(true)
  }

  const confirmCanje = async () => {
    if (!selectedPerk) return
    setLoading(true)
    setErrorMsg("")

    const res = await fetch('/api/canjear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ perkId: selectedPerk.id }),
    })

    const result = await res.json()

    if (res.ok) {
      toast.success('Perk canjeado correctamente')
      setDialogOpen(false)
      await fetchPerks()
      await fetchUserPerks()
    } else {
      toast.error(result.error || 'Error al canjear perk')
      setErrorMsg(result.error)
    }

    setLoading(false)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button
        onClick={() => window.history.back()}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </button
