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
    <aside className="w-64 bg-black text-white flex flex-col">
      {/* Logo e Info do Usuário */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-bold text-lg">
            OT
          </div>
          <h1 className="text-xl font-bold">Ogum Tech</h1>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-white">{user.name}</p>
          <p className="text-gray-400 text-xs mt-1">
            {user.role === 'admin' ? 'Administrador' : 'Usuário'}
          </p>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 p-4 space-y-1">
        <Link
          href="/dashboard"
          className={`block px-4 py-3 font-medium transition-colors ${
            isActive('/dashboard')
              ? 'bg-white text-black'
              : 'text-gray-300 hover:bg-gray-900 hover:text-white'
          }`}
        >
          <span aria-hidden="true" className="mr-2">■</span>
          Dashboard
        </Link>

        {user.role === 'admin' && (
          <Link
            href="/dashboard/admin"
            className={`block px-4 py-3 font-medium transition-colors ${
              isActive('/dashboard/admin')
                ? 'bg-white text-black'
                : 'text-gray-300 hover:bg-gray-900 hover:text-white'
            }`}
          >
            <span aria-hidden="true" className="mr-2">■</span>
            Administração
          </Link>
        )}
      </nav>

      {/* Botão Sair */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 bg-white text-black hover:bg-gray-200 transition-colors font-semibold"
        >
          Sair
        </button>
      </div>
        <div className="mt-auto p-4 text-xs text-gray-400 border-t border-gray-800 text-center">
          © 2025 Ogum Tech.<br />Licenciado sob MIT License.<br />Desenvolvido com <span aria-label="amor" role="img">❤️</span> por <a href="https://github.com/dev-mateus" className="underline hover:text-white">Mateus</a>
        </div>
    </aside>
  )
}
