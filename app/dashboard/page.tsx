"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string } | null>(null)

  useEffect(() => {
    // Esto lo cambiaremos luego por lectura real de sesión (JWT o cookie)
    setUser({ name: "Administrador" })
  }, [])

  const handleLogout = () => {
    // Aquí luego borraremos JWT/cookie real
    setUser(null)
    router.push("/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader className="flex flex-col items-center justify-center space-y-4 pt-6">
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-4xl text-white">
            👤
          </div>
          <h1 className="text-xl font-semibold text-center">
            Bienvenido{user ? `, ${user.name}` : ""} 🎉
          </h1>
        </CardHeader>
        <CardContent className="px-6 pb-6 space-y-4">
          <div className="grid gap-3">
            <a className="block bg-blue-100 text-blue-900 font-medium px-4 py-2 rounded-md hover:bg-blue-200 transition" href="#">
              👤 Perfil de usuario
            </a>
            <a className="block bg-blue-100 text-blue-900 font-medium px-4 py-2 rounded-md hover:bg-blue-200 transition" href="#">
              📣 Comunicados
            </a>
            <a className="block bg-blue-100 text-blue-900 font-medium px-4 py-2 rounded-md hover:bg-blue-200 transition" href="#">
              🎁 Catálogo de beneficios
            </a>
            <a className="block bg-blue-100 text-blue-900 font-medium px-4 py-2 rounded-md hover:bg-blue-200 transition" href="#">
              🧾 Historial de canjes
            </a>
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-red-700 transition"
            >
              Cerrar sesión
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
