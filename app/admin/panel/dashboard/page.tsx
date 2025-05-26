import { prisma } from '@/lib/prisma'

export default async function AdminDashboard() {
  const totalUsuarios = await prisma.user.count()
  const totalPerks = await prisma.perk.count()
  const totalCanjes = await prisma.canje.count()

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-center">Panel de administración</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Usuarios */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Usuarios</h2>
          <p className="text-4xl text-blue-600 font-semibold">{totalUsuarios}</p>
          <p className="text-gray-500">Dados de alta</p>
        </div>

        {/* Perks */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Perks</h2>
          <p className="text-4xl text-green-600 font-semibold">{totalPerks}</p>
          <p className="text-gray-500">Totales en catálogo</p>
        </div>

        {/* Canjes */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Canjes</h2>
          <p className="text-4xl text-purple-600 font-semibold">{totalCanjes}</p>
          <p className="text-gray-500">Realizados</p>
        </div>
      </div>
    </div>
  )
}

