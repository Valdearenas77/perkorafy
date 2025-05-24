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
      </button>

      <h1 className="text-2xl font-bold mb-2 text-center">Catálogo de beneficios</h1>

      {userPerks !== null && (
        <p className="text-center text-sm text-gray-700 mb-6">
          Tienes <strong>{userPerks}</strong> perks disponibles
        </p>
      )}

      {isLoading ? (
        <p className="text-center text-gray-500">Cargando beneficios...</p>
      ) : perks.length === 0 ? (
        <p className="text-center text-gray-500">No hay perks disponibles por ahora.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {perks.map((perk) => {
            const puedeCanjear = userPerks !== null ? userPerks >= perk.puntos : true

            return (
              <div
                key={perk.id}
                className={`border rounded-md p-4 shadow-sm transition-opacity ${
                  !puedeCanjear ? 'opacity-50' : ''
                }`}
              >
                <h2 className="font-semibold text-lg">{perk.nombre}</h2>
                <p className="text-sm text-gray-600 mb-2">{perk.descripcion}</p>
                <p className="text-sm font-bold mb-3">Coste: {perk.puntos} perks</p>
                <Button
                  onClick={() => handleCanjear(perk)}
                  disabled={!puedeCanjear}
                  className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                >
                  Canjear
                </Button>
              </div>
            )
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>¿Confirmar canje?</DialogHeader>
          <p className="text-sm">
            ¿Seguro que quieres canjear <strong>{selectedPerk?.nombre}</strong> por{' '}
            <strong>{selectedPerk?.puntos}</strong> perks?
          </p>

          {errorMsg && <p className="text-sm text-red-600 mt-2">{errorMsg}</p>}

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
