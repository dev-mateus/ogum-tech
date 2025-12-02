'use client'

import { useState } from 'react'
import { createFunction, createGiraType, createGira, getFunctions, getGiraTypes } from '@/app/actions/admin'
import { createUser } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'

export default function AdminForms() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'function' | 'giraType' | 'user' | 'gira'>('function')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Function
  const [functionName, setFunctionName] = useState('')

  async function handleCreateFunction(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const result = await createFunction({ name: functionName })

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Função criada com sucesso!' })
      setFunctionName('')
      router.refresh()
    }
    setLoading(false)
  }

  // Gira Type
  const [giraTypeName, setGiraTypeName] = useState('')

  async function handleCreateGiraType(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const result = await createGiraType({ name: giraTypeName })

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Tipo de gira criado com sucesso!' })
      setGiraTypeName('')
      router.refresh()
    }
    setLoading(false)
  }

  // User
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [userRole, setUserRole] = useState<'admin' | 'user'>('user')
  const [userFunctionId, setUserFunctionId] = useState('')
  const [functions, setFunctions] = useState<any[]>([])

  async function loadFunctions() {
    const result = await getFunctions()
    if (result.success) {
      setFunctions(result.functions || [])
    }
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const result = await createUser({
      name: userName,
      email: userEmail,
      password: userPassword,
      role: userRole,
      functionId: userFunctionId ? parseInt(userFunctionId) : undefined,
    })

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Usuário criado com sucesso!' })
      setUserName('')
      setUserEmail('')
      setUserPassword('')
      setUserRole('user')
      setUserFunctionId('')
      router.refresh()
    }
    setLoading(false)
  }

  // Gira
  const [giraTypeId, setGiraTypeId] = useState('')
  const [giraTypes, setGiraTypes] = useState<any[]>([])

  async function loadGiraTypes() {
    const result = await getGiraTypes()
    if (result.success) {
      setGiraTypes(result.giraTypes || [])
    }
  }

  async function handleCreateGira(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const result = await createGira({ giraTypeId: parseInt(giraTypeId) })

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Gira aberta com sucesso!' })
      setGiraTypeId('')
      router.push('/dashboard')
      router.refresh()
    }
    setLoading(false)
  }

  // Load data when switching tabs
  function handleTabChange(tab: typeof activeTab) {
    setActiveTab(tab)
    setMessage(null)
    if (tab === 'user' && functions.length === 0) loadFunctions()
    if (tab === 'gira' && giraTypes.length === 0) loadGiraTypes()
  }

  const inputClass = "w-full px-4 py-3 bg-white border-2 border-gray-300 text-black placeholder-gray-400 focus:border-black focus:ring-0 transition-colors font-medium"
  const labelClass = "block text-sm font-bold text-black mb-2 uppercase tracking-wide"
  const buttonClass = "px-6 py-3 bg-black text-white font-bold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"

  return (
    <div className="bg-white border-2 border-black">
      {/* Tabs */}
      <div className="border-b-2 border-black">
        <nav className="flex">
          {[
            { key: 'function', label: 'Funções' },
            { key: 'giraType', label: 'Tipos de Gira' },
            { key: 'user', label: 'Usuários' },
            { key: 'gira', label: 'Abrir Gira' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key as typeof activeTab)}
              className={`px-8 py-4 text-sm font-bold uppercase tracking-wide transition-colors ${
                activeTab === tab.key
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-8">
        {message && (
          <div
            className={`mb-6 p-4 border-2 font-medium ${
              message.type === 'success' ? 'bg-gray-100 border-black text-black' : 'bg-white border-black text-black'
            }`}
            role="alert"
          >
            {message.text}
          </div>
        )}

        {activeTab === 'function' && (
          <form onSubmit={handleCreateFunction} className="space-y-6 max-w-md">
            <div>
              <label className={labelClass}>
                Nome da Função
              </label>
              <input
                type="text"
                value={functionName}
                onChange={(e) => setFunctionName(e.target.value)}
                placeholder="Ex: Médium, Cambone, Ogã"
                required
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={buttonClass}
            >
              {loading ? 'Criando...' : 'Criar Função'}
            </button>
          </form>
        )}

        {activeTab === 'giraType' && (
          <form onSubmit={handleCreateGiraType} className="space-y-6 max-w-md">
            <div>
              <label className={labelClass}>
                Nome do Tipo de Gira
              </label>
              <input
                type="text"
                value={giraTypeName}
                onChange={(e) => setGiraTypeName(e.target.value)}
                placeholder="Ex: Preto-Velho, Caboclo, Exu"
                required
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={buttonClass}
            >
              {loading ? 'Criando...' : 'Criar Tipo de Gira'}
            </button>
          </form>
        )}

        {activeTab === 'user' && (
          <form onSubmit={handleCreateUser} className="space-y-6 max-w-md">
            <div>
              <label className={labelClass}>Nome</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                className={inputClass}
                placeholder="Nome completo"
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
                className={inputClass}
                placeholder="email@exemplo.com"
              />
            </div>
            <div>
              <label className={labelClass}>Senha</label>
              <input
                type="password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                required
                minLength={6}
                className={inputClass}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div>
              <label className={labelClass}>Tipo</label>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as 'admin' | 'user')}
                className={inputClass}
              >
                <option value="user">Usuário</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Função (opcional)</label>
              <select
                value={userFunctionId}
                onChange={(e) => setUserFunctionId(e.target.value)}
                className={inputClass}
              >
                <option value="">Nenhuma</option>
                {functions.map((func) => (
                  <option key={func.id} value={func.id}>
                    {func.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={buttonClass}
            >
              {loading ? 'Criando...' : 'Criar Usuário'}
            </button>
          </form>
        )}

        {activeTab === 'gira' && (
          <form onSubmit={handleCreateGira} className="space-y-6 max-w-md">
            <div>
              <label className={labelClass}>
                Tipo de Gira
              </label>
              <select
                value={giraTypeId}
                onChange={(e) => setGiraTypeId(e.target.value)}
                required
                className={inputClass}
              >
                <option value="">Selecione...</option>
                {giraTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={buttonClass}
            >
              {loading ? 'Abrindo...' : 'Abrir Gira'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
