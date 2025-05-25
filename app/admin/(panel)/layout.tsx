import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-6">
        <h1 className="text-2xl font-bold mb-8 bg-yellow-300 p-2">🧪 ESTO ES EL LAYOUT DEL PANEL</h1>
        <nav className="flex flex-col gap-4">
          <Link href="/admin/dashboard">Dashboard</Link>
          <Link href="/admin/usuarios">Usuarios</Link>
          <Link href="/admin/perks">Perks</Link>
          <Link href="/admin/canjes">Canjes</Link>
        </nav>
      </aside>

      <main className="flex-1 bg-gray-100 p-8">
        {children}
      </main>
    </div>
  )
}
