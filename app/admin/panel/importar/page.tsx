'use client'

import { useState } from 'react'
import Papa from 'papaparse'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type UsuarioImportado = {
  name: string
  email: string
  perks: number
}

export default function ImportarUsuariosPage() {
  const [usuarios, setUsuarios] = useState<UsuarioImportado[]>([])
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState<boolean>(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      setError('El archivo debe ser un CSV válido.')
      return
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const data: UsuarioImportado[] = []

        for (const row of result.data as any[]) {
          if (!row.name || !row.email) {
            setError('Faltan campos obligatorios (name, email) en alguna fila.')
            return
          }

          const perks = parseInt(row.perks) || 0
          data.push({ name: row.name.trim(), email: row.email.trim(), perks })
        }

        setUsuarios(data)
        setError(null)
      },
      error: () => {
        setError('Error al leer el fichero CSV.')
      }
    })
  }

  const enviarAlServidor = async () => {
    try {
      setCargando(true)

      const res = await fetch('/api/admin/importar-usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': process.env.NEXT_PUBLIC_ADMIN_TOKEN || ''  // ajustar aquí si necesitas un token real
        },
        body: JSON.stringify(usuarios)
      })

      const data = await res.json()

      if (res.ok) {
        toast.success('Usuarios importados correctamente.')
        console.log('Resultado:', data)
        setUsuarios([])
      } else {
        toast.error(data.error || 'Error al importar.')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error de red o servidor.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Importar Usuarios</h1>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="mb-4"
      />

      {error && (
        <div className="bg-red-200 text-red-800 p-2 rounded mb-4">
          {error}
        </div>
      )}

      {usuarios.length > 0 && (
        <div className="bg-green-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Previsualización:</h2>
          <ul className="space-y-1">
            {usuarios.map((u, i) => (
              <li key={i}>
                {u.name} - {u.email} - {u.perks} perks
              </li>
            ))}
          </ul>
          <Button onClick={enviarAlServidor} disabled={cargando} className="mt-4 px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
            {cargando ? 'Importando...' : 'Enviar al servidor'}
          </Button>
        </div>
      )}
    </div>
  )
}

