'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  name: string
  email: string
  role: string
}

export default function Sidebar({ user }: { user: User }) {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (path: string) => pathname === path

  async function handleLogout() {
    await logout()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-64 bg-purple-900 text-white flex flex-col">
      <div className="p-6 border-b border-purple-800">
        <h1 className="text-2xl font-bold">Ogum Tech</h1>
        <p className="text-sm text-purple-200 mt-1">{user.name}</p>
        <p className="text-xs text-purple-300">{user.role === 'admin' ? 'Administrador' : 'Usuário'}</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link
          href="/dashboard"
          className={`block px-4 py-3 rounded-lg transition-colors ${
            isActive('/dashboard')
              ? 'bg-purple-800 text-white'
              : 'text-purple-100 hover:bg-purple-800/50'
          }`}
        >
          📊 Dashboard
        </Link>

        {user.role === 'admin' && (
          <Link
            href="/dashboard/admin"
            className={`block px-4 py-3 rounded-lg transition-colors ${
              isActive('/dashboard/admin')
                ? 'bg-purple-800 text-white'
                : 'text-purple-100 hover:bg-purple-800/50'
            }`}
          >
            ⚙️ Administração
          </Link>
        )}
      </nav>

      <div className="p-4 border-t border-purple-800">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-white font-medium"
        >
          🚪 Sair
        </button>
      </div>
    </aside>
  )
}
