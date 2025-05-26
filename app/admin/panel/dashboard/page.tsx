import { prisma } from '@/lib/prisma'

export default async function AdminDashboard() {
  const totalUsuarios = await prisma.user.count()
  const totalBeneficios = await prisma.perk.count()
  const totalCanjes = await prisma.canje.count()
  const sumaPerks = await prisma.user.aggregate({ _sum: { perks: true } })

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-center">Panel de administración</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Usuarios */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Usuarios</h2>
          <p className="text-4xl text-blue-600 font-semibold">{totalUsuarios}</p>
          <p className="text-gray-500">Dados de alta</p>
        </div>

        {/* Beneficios */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Beneficios</h2>
          <p className="text-4xl text-green-600 font-semibold">{totalBeneficios}</p>
          <p className="text-gray-500">En el catálogo</p>
        </div>

        {/* Canjes */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Canjes</h2>
          <p className="text-4xl text-purple-600 font-semibold">{totalCanjes}</p>
          <p className="text-gray-500">Realizados</p>
        </div>

        {/* Perks acumulados */}
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Perks acumulados</h2>
          <p className="text-4xl text-orange-500 font-semibold">
            {sumaPerks._sum.perks ?? 0}
          </p>
          <p className="text-gray-500">Entre todos los usuarios</p>
        </div>
      </div>
    </div>
  )
}
