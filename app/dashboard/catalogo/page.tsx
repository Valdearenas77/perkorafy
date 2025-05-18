"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import ConfirmarCanjeDialog from '@/components/ConfirmarCanjeDialog'

interface Perk {
  id: number
  nombre: string
  descripcion: string
  puntos: number
  imagen: string
}

const perks: Perk[] = [
  {
    id: 1,
    nombre: 'Día libre',
    descripcion: 'Disfruta de un día libre adicional',
    puntos: 200,
    imagen: '/perks/dia-libre.png',
  },
  {
    id: 2,
    nombre: 'Vale Amazon 50€',
    descripcion: 'Tarjeta regalo de Amazon valorada en 50€',
    puntos: 500,
    imagen: '/perks/amazon-50.png',
  },
  {
    id: 3,
    nombre: 'Entrada cine',
    descripcion: '2 entradas para el cine',
    puntos: 150,
    imagen: '/perks/cine.png',
  },
]

export default function CatalogoPage() {
  const [usuario, setUsuario] = useState('')
  const [perksUsuario, setPerksUsuario] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/user', { credentials: 'include' })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setUsuario(data.name)
        setPerksUsuario(data.perks)
      })
      .catch(() => window.location.href = '/login')
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <a href="/dashboard" className="inline-flex items-center text-blue-600 hover:underline mb-4">
        ← Volver al panel
      </a>
      <h1 className="text-2xl font-bold mb-6 text-center">🎁 Catálogo de beneficios</h1>
      {perksUsuario !== null && (
        <p className="text-center text-lg font-medium text-gray-700 mb-6">
          Tienes <span className="text-blue-600 font-bold">{perksUsuario}</span> perks disponibles
        </p>
      )}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {perks.map(perk => (
          <Card key={perk.id} className="rounded-xl shadow-md hover:shadow-lg transition">
            <CardHeader className="p-4">
              <img src={perk.imagen} alt={perk.nombre} className="w-full h-40 object-cover rounded-md" />
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-2">
              <h2 className="text-lg font-semibold">{perk.nombre}</h2>
              <p className="text-sm text-gray-600">{perk.descripcion}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="font-bold text-blue-600">{perk.puntos} perks</span>
                {perksUsuario !== null && perksUsuario >= perk.puntos ? (
                  <ConfirmarCanjeDialog
                    perkId={perk.id}
                    perkNombre={perk.nombre}
                  />
                ) : (
                  <span className="text-sm text-red-500">Insuficientes</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}



