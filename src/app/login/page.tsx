'use client'

import { login } from '@/app/actions/auth'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login({ email, password })

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 space-y-8">
        {/* Logo e Título */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black text-white text-2xl font-bold mb-4">
            OT
          </div>
          <h1 className="text-3xl font-bold text-black tracking-tight">Ogum Tech</h1>
          <p className="text-gray-600 text-sm">Sistema de Gerenciamento de Giras</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-black mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 text-black placeholder-gray-400 focus:border-black focus:ring-0 transition-colors"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-black mb-2">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 text-black placeholder-gray-400 focus:border-black focus:ring-0 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-4 bg-gray-100 border-2 border-black" role="alert">
              <p className="text-sm font-medium text-black">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-black text-white font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Nota */}
        <div className="text-center">
          <p className="text-xs text-gray-600">Primeiro acesso? Entre em contato com o administrador</p>
        </div>
      </div>
    </div>
  )
}
