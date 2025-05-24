'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

type Perk = {
  id: string
  nombre: string
  descripcion: string
  coste: number
}

export default function Catalogo() {
  const [perks, setPerks] = useState<Perk[]>([])
  const [selectedPerk, setSelectedPerk] = useState<Perk | null>(null)
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const fetchPerks = async () => {
    const res = await fetch('/api/perks')
    const data = await res.json()
    setPerks(data)
  }

  useEffect(() => {
    fetchPerks()
  }, [])

  const handleCanjear = (perk: Perk) => {
    setSelectedPerk(perk)
    setDialogOpen(true)
  }

  const confirmCanje = async () => {
    if (!selectedPerk) return
    setLoading(true)

    const res = await fetch('/api/canjear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ perkId: selectedPerk.id }),
    })

    if (res.ok) {
      toast.success('Perk canjeado correctamente')
      setDialogOpen(false)
      await fetchPerks() // actualizar perks disponibles
    } else {
      toast.error('No se pudo canjear el perk')
    }

    setLoading(false)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Catálogo de beneficios</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {perks.map((perk) => (
          <div key={perk.id} className="border rounded-md p-4 shadow-sm">
            <h2 className="font-semibold text-lg">{perk.nombre}</h2>
            <p className="text-sm text-gray-600 mb-2">{perk.descripcion}</p>
            <p className="text-sm font-bold mb-3">Coste: {perk.coste} perks</p>
            <Button
              onClick={() => handleCanjear(perk)}
              className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-blue-700 transition"
            >
              Canjear
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>¿Confirmar canje?</DialogHeader>
          <p className="text-sm">
            ¿Seguro que quieres canjear <strong>{selectedPerk?.nombre}</strong> por{' '}
            <strong>{selectedPerk?.coste}</strong> puntos?
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              onClick={() => setDialogOpen(false)}
              className="bg-gray-300 text-sm px-4 py-1.5 rounded-md hover:bg-gray-400 transition"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmCanje}
              disabled={loading}
              className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-blue-700 transition"
            >
              {loading ? 'Procesando...' : 'Confirmar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
