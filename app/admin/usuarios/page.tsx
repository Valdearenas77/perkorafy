'use client'

import { useEffect, useState } from 'react'

type Usuario = {
  id: number
  name: string
  email: string
  perks: number
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])

  useEffect(() => {
    fetch('/api/admin/usuarios')
      .then(res => res.json())
      .then(data => setUsuarios(data))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Gestión de Usuarios</h1>
      <table className="w-full bg-white shadow rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-2">Nombre</th>
            <th className="text-left px-4 py-2">Email</th>
            <th className="text-left px-4 py-2">Perks</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id} className="border-t">
              <td className="px-4 py-2">{usuario.name}</td>
              <td className="px-4 py-2">{usuario.email}</td>
              <td className="px-4 py-2">{usuario.perks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
