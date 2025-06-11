'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserActions } from '@/components/admin/UserActions'
import { EditarPerksModal } from '@/components/admin/EditarPerksModal'

type Usuario = {
  id: number
  name: string
  email: string
  perks: number
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [usuarioActivo, setUsuarioActivo] = useState<Usuario | null>(null)
  const [modalAbierto, setModalAbierto] = useState(false)

  const [crearAbierto, setCrearAbierto] = useState(false)
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [nuevoEmail, setNuevoEmail] = useState('')
  const [nuevoPerks, setNuevoPerks] = useState(0)

  const [passwordVisible, setPasswordVisible] = useState('')
  const [passwordReal, setPasswordReal] = useState('')

  const [csvAbierto, setCsvAbierto] = useState(false)

  useEffect(() => {
    fetch('/api/admin/usuarios')
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
  }, [])

  const abrirModal = (usuario: Usuario) => {
    setUsuarioActivo(usuario)
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    // Limpiar el usuario activo después de un pequeño delay
    setTimeout(() => {
      setUsuarioActivo(null)
    }, 150)
  }

  const actualizarLista = () => {
    fetch('/api/admin/usuarios')
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
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

    setPasswordReal((prev) => prev + char)
    setPasswordVisible((prev) => prev + char)

    setTimeout(() => {
      setPasswordVisible((prev) => '*'.repeat(prev.length))
    }, 2000)
  }

  const handleEditar = (usuario: Usuario) => abrirModal(usuario)

  const handleResetPassword = async (usuario: Usuario) => {
    try {
      const res = await fetch(`/api/admin/usuarios/${usuario.id}/reset-password`, {
        method: 'POST',
      })

      if (res.ok) {
        toast.success(`Email de recuperación enviado a ${usuario.email}`)
      } else {
        const data = await res.json()
        toast.error(data.error || 'Error al generar token')
      }
    } catch {
      toast.error('Error de red al intentar resetear la contraseña')
    }
  }

  const handleEliminar = async (usuario: Usuario) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar a ${usuario.name}? Esta acción no se puede deshacer.`)) return

    try {
      const res = await fetch(`/api/admin/usuarios/${usuario.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success('Usuario eliminado correctamente')
        setUsuarios((prev) => prev.filter((u) => u.id !== usuario.id))
      } else {
        const data = await res.json()
        toast.error(data.error || 'Error al eliminar el usuario')
      }
    } catch {
      toast.error('Error de red al intentar eliminar el usuario')
    }
  }

  const cumpleLongitud = passwordReal.length >= 6
  const tieneMayuscula = /[A-Z]/.test(passwordReal)
  const tieneNumero = /[0-9]/.test(passwordReal)
  const passwordValida = cumpleLongitud && tieneMayuscula && tieneNumero

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
            <th className="text-right px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id} className="border-t">
              <td className="px-4 py-2">{usuario.name}</td>
              <td className="px-4 py-2">{usuario.email}</td>
              <td className="px-4 py-2">{usuario.perks}</td>
              <td className="px-4 py-2 text-right">
                <UserActions
                  onEdit={() => handleEditar(usuario)}
                  onResetPassword={() => handleResetPassword(usuario)}
                  onDelete={() => handleEliminar(usuario)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal personalizado que no interfiere con la página */}
      <EditarPerksModal
        open={modalAbierto}
        onClose={cerrarModal}
        usuario={usuarioActivo}
        refresh={actualizarLista}
      />

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

            <div>
              <Input
                placeholder="Contraseña"
                type="text"
                value={passwordVisible}
                onChange={handlePasswordChange}
              />

              <div className="text-sm mt-2 space-y-1 text-left">
                <p className={cumpleLongitud ? 'text-green-600' : 'text-red-500'}>
                  • Mínimo 6 caracteres
                </p>
                <p className={tieneMayuscula ? 'text-green-600' : 'text-red-500'}>
                  • Al menos una mayúscula
                </p>
                <p className={tieneNumero ? 'text-green-600' : 'text-red-500'}>
                  • Al menos un número
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setCrearAbierto(false)}>
                Cancelar
              </Button>
              <Button
                onClick={crearUsuario}
                disabled={!passwordValida}
                className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Crear
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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


