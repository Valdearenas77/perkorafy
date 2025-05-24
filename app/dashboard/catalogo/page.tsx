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
  coste: number
}

export default function Catalogo() {
  const [perks, setPerks] = useState<Perk[]>([])
  const [selectedPerk, setSelectedPerk] = useState<Perk | null>(null)
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const fetchPerks = async () => {
    try {
      const res = await fetch('/api/perks')
      if (!res.ok) throw new Error('Error al cargar perks')
      const data = await res.json()
      setPerks(data)
    } catch (error) {
      toast.error('No se pudieron cargar los perks')
      console.error(error)
    }
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
      await fetchPerks()
    } else {
      toast.error('Error al canjear perk')
    }

    setLoading(false)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Botón volver */}
      <button
        onClick={() => window.history.back()}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </button>

      {/* Título */}
      <h1 className="text-2xl font-bold mb-4 text-center">Catálogo de beneficios</h1>

      {/* Lista de perks */}
      {perks.length === 0 ? (
        <p className="text-center text-gray-500">Cargando beneficios o no hay perks disponibles.</p>
      ) : (
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
      )}

      {/* Diálogo de confirmación */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>¿Confirmar canje?</DialogHeader>
          <p className="text-sm">
            ¿Seguro que quieres canjear <strong>{selectedPerk?.nombre}</strong> por{' '}
            <strong>{selectedPerk?.coste}</strong> perks?
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
