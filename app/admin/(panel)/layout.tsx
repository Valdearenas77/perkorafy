import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">🧪 Layout ACTIVO</h1>
        <nav className="flex flex-col gap-4">
          <Link href="/admin/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link href="/admin/usuarios" className="hover:underline">
            Usuarios
          </Link>
          <Link href="/admin/perks" className="hover:underline">
            Perks
          </Link>
          <Link href="/admin/canjes" className="hover:underline">
            Canjes
          </Link>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 bg-gray-100 p-8">
        {children}
      </main>
    </div>
  )
}
