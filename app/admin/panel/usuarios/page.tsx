'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

type Usuario = {
  id: number
  name: string
  email: string
  perks: number
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [usuarioActivo, setUsuarioActivo] = useState<Usuario | null>(null)
  const [nuevoPerk, setNuevoPerk] = useState<number>(0)
  const [abierto, setAbierto] = useState(false)

  useEffect(() => {
    fetch('/api/admin/usuarios')
      .then(res => res.json())
      .then(data => setUsuarios(data))
  }, [])

  const abrirModal = (usuario: Usuario) => {
    setUsuarioActivo(usuario)
    setNuevoPerk(usuario.perks)
    setAbierto(true)
  }

  const guardarPerks = async () => {
    if (!usuarioActivo) return
    try {
      const res = await fetch(`/api/admin/usuarios/${usuarioActivo.id}/perks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ perks: nuevoPerk }),
      })

      if (res.ok) {
        toast.success('Perks actualizados')
        setUsuarios((prev) =>
          prev.map((u) => (u.id === usuarioActivo.id ? { ...u, perks: nuevoPerk } : u))
        )
        setAbierto(false)
      } else {
        const data = await res.json()
        toast.error(data.error || 'Error al actualizar perks')
      }
    } catch {
      toast.error('Error de conexión con el servidor')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Gestión de Usuarios</h1>
      <table className="w-full bg-white shadow rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-2">Nombre</th>
            <th className="text-left px-4 py-2">Email</th>
            <th className="text-left px-4 py-2">Perks</th>
            <th className="text-left px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id} className="border-t">
              <td className="px-4 py-2">{usuario.name}</td>
              <td className="px-4 py-2">{usuario.email}</td>
              <td className="px-4 py-2">{usuario.perks}</td>
              <td className="px-4 py-2">
                <Button className="px-4 py-1.5 text-sm" onClick={() => abrirModal(usuario)}>
                  Editar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog open={abierto} onOpenChange={setAbierto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar perks</DialogTitle>
          </DialogHeader>

          {usuarioActivo && (
            <div className="space-y-4">
              <p>
                Usuario: <strong>{usuarioActivo.name}</strong>
              </p>
              <label className="block text-sm font-medium mb-1">
                Perks actuales: {usuarioActivo.perks}
              </label>
              <input
                type="number"
                value={nuevoPerk}
                onChange={(e) => setNuevoPerk(parseInt(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setAbierto(false)}>
                  Cancelar
                </Button>
                <Button onClick={guardarPerks}>Guardar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
