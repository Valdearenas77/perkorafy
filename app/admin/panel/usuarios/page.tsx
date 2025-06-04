'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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

  const [crearAbierto, setCrearAbierto] = useState(false)
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [nuevoEmail, setNuevoEmail] = useState('')
  const [nuevoPerks, setNuevoPerks] = useState(0)

  const [passwordVisible, setPasswordVisible] = useState('')
  const [passwordReal, setPasswordReal] = useState('')

  const [csvAbierto, setCsvAbierto] = useState(false)

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
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ perks: nuevoPerk }),
      })

      if (res.ok) {
        toast.success('Perks actualizados')
        setUsuarios((prev) =>
          prev.map((u) => (u.id === usuarioActivo.id ? { ...u, perks: nuevoPerk } : u))
        )
        setAbierto(false)
        window.location.href = '/admin/panel/dashboard'
      } else {
        const data = await res.json()
        toast.error(data.error || 'Error al actualizar perks')
      }
    } catch {
      toast.error('Error de conexión con el servidor')
    }
  }

  const crearUsuario = async () => {
    if (!nuevoNombre || !nuevoEmail || nuevoPerks < 0 || !passwordReal) {
      toast.error('Todos los campos son obligatorios')
      return
    }

    try {
      const res = await fetch('/api/admin/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nuevoNombre,
          email: nuevoEmail,
          perks: nuevoPerks,
          password: passwordReal,
        }),
      })

      if (res.ok) {
        const creado = await res.json()
        toast.success('Usuario creado correctamente')
        setUsuarios((prev) => [...prev, creado])
        setCrearAbierto(false)
        setNuevoNombre('')
        setNuevoEmail('')
        setNuevoPerks(0)
        setPasswordReal('')
        setPasswordVisible('')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Error al crear usuario')
      }
    } catch {
      toast.error('Error de conexión con el servidor')
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const char = e.target.value.slice(-1)
    if (!char) return

    setPasswordReal(prev => prev + char)
    setPasswordVisible(prev => prev + char)

    setTimeout(() => {
      setPasswordVisible(prev => {
        const masked = '*'.repeat(prev.length)
        return masked
      })
    }, 2000)
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Gestión de Usuarios</h1>

      <div className="flex gap-4">
        <Button
          onClick={() => setCrearAbierto(true)}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Crear usuario
        </Button>
        <Button
          variant="outline"
          onClick={() => setCsvAbierto(true)}
          className="px-3 py-1 text-sm rounded-md"
        >
          Importar CSV
        </Button>
      </div>

      <table className="w-full bg-white shadow rounded-lg mt-4">
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
                <Button
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={() => abrirModal(usuario)}
                >
                  Editar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal editar perks */}
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
                onChange={(e) => setNuevoPerk(Number(e.target.value) || 0)}
                className="w-full border rounded px-3 py-2"
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setAbierto(false)}
                  className="px-3 py-1 text-sm rounded-md"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={guardarPerks}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Guardar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal crear usuario */}
      <Dialog open={crearAbierto} onOpenChange={setCrearAbierto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear nuevo usuario</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Nombre"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
            />
            <Input
              placeholder="Email"
              type="email"
              value={nuevoEmail}
              onChange={(e) => setNuevoEmail(e.target.value)}
            />
            <Input
              placeholder="Perks iniciales"
              type="number"
              value={nuevoPerks}
              onChange={(e) => setNuevoPerks(Number(e.target.value))}
            />
            <Input
              placeholder="Contraseña"
              type="text"
              value={passwordVisible}
              onChange={handlePasswordChange}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setCrearAbierto(false)}
                className="px-3 py-1 text-sm rounded-md"
              >
                Cancelar
              </Button>
              <Button
                onClick={crearUsuario}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Crear
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal importar CSV (a implementar) */}
      <Dialog open={csvAbierto} onOpenChange={setCsvAbierto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar usuarios desde CSV</DialogTitle>
          </DialogHeader>

          <p>Este formulario se implementará a continuación.</p>
        </DialogContent>
      </Dialog>
    </div>
  )
}

