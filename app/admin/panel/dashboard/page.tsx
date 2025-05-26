'use client'

import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const [token, setToken] = useState('')

  useEffect(() => {
    const cookies = document.cookie
    const match = cookies.match(/adminToken=([^;]+)/)
    if (match) {
      setToken(match[1])
    } else {
      setToken('No se encontró la cookie adminToken')
    }
  }, [])

  return (
    <div className="text-center">
      <h1 className="text-2xl font-semibold mb-2">Bienvenido al panel de administración</h1>
      <p className="text-gray-600 mb-4">Desde aquí puedes gestionar usuarios, perks y canjes.</p>

      <div className="mt-6 p-4 bg-gray-100 rounded shadow text-left max-w-xl mx-auto">
        <h2 className="font-semibold mb-2 text-lg">🔍 Token detectado en cookie:</h2>
        <code className="text-sm break-all block bg-white p-2 rounded border">
          {token}
        </code>
      </div>
    </div>
  )
}
