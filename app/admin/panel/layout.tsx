import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">Perkorafy Admin</h1>
        <nav className="flex flex-col gap-4">
          <Link href="/admin/panel/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link href="/admin/panel/usuarios" className="hover:underline">
            Usuarios
          </Link>
          <Link href="/admin/panel/perks" className="hover:underline">
            Perks
          </Link>
          <Link href="/admin/panel/canjes" className="hover:underline">
            Canjes
          </Link>
        </nav>
      </aside>

      <main className="flex-1 bg-gray-100 p-8">
        {children}
      </main>
    </div>
  )
}
