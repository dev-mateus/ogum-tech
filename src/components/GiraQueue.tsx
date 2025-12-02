'use client'

import { useState, useEffect } from 'react'
import { addToQueue, assignMedium, updateQueueStatus } from '@/app/actions/queue'
import { useRouter } from 'next/navigation'

interface QueueEntry {
  id: number
  consultantName: string
  consultantPhone: string | null
  sequence: number
  status: string
  assignedMedium: {
    id: number
    name: string
    function: { name: string } | null
  } | null
  createdAt: string
  startedAt: string | null
  finishedAt: string | null
}

interface Medium {
  id: number
  name: string
  function: { name: string } | null
}

export default function GiraQueue({
  giraId,
  initialQueue,
  mediums,
}: {
  giraId: number
  initialQueue: QueueEntry[]
  mediums: Medium[]
}) {
  const router = useRouter()
  const [queue, setQueue] = useState(initialQueue)
  const [consultantName, setConsultantName] = useState('')
  const [consultantPhone, setConsultantPhone] = useState('')
  const [loading, setLoading] = useState(false)

  // Auto-refresh a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh()
    }, 5000)

    return () => clearInterval(interval)
  }, [router])

  async function handleAddToQueue(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const result = await addToQueue({
      giraId,
      consultantName,
      consultantPhone: consultantPhone || undefined,
    })

    if (result.success) {
      setConsultantName('')
      setConsultantPhone('')
      router.refresh()
    }

    setLoading(false)
  }

  async function handleAssignMedium(queueEntryId: number, mediumId: number) {
    await assignMedium({ queueEntryId, mediumId })
    router.refresh()
  }

  async function handleUpdateStatus(queueEntryId: number, status: string) {
    await updateQueueStatus({
      queueEntryId,
      status: status as 'aguardando' | 'em_atendimento' | 'atendido' | 'cancelado',
    })
    router.refresh()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aguardando':
        return 'bg-yellow-100 text-yellow-800'
      case 'em_atendimento':
        return 'bg-blue-100 text-blue-800'
      case 'atendido':
        return 'bg-green-100 text-green-800'
      case 'cancelado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'aguardando':
        return 'Aguardando'
      case 'em_atendimento':
        return 'Em Atendimento'
      case 'atendido':
        return 'Atendido'
      case 'cancelado':
        return 'Cancelado'
      default:
        return status
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Formulário de Adicionar */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow p-6 sticky top-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Adicionar Consulente</h2>
          <form onSubmit={handleAddToQueue} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome *
              </label>
              <input
                type="text"
                value={consultantName}
                onChange={(e) => setConsultantName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Nome do consulente"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone (opcional)
              </label>
              <input
                type="tel"
                value={consultantPhone}
                onChange={(e) => setConsultantPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="(00) 00000-0000"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
            >
              {loading ? 'Adicionando...' : 'Adicionar à Fila'}
            </button>
          </form>

          {mediums.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Médiuns Presentes</h3>
              <div className="space-y-1">
                {mediums.map((medium) => (
                  <div key={medium.id} className="text-sm text-gray-600">
                    {medium.name}
                    {medium.function && (
                      <span className="text-gray-400"> ({medium.function.name})</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fila */}
      <div className="lg:col-span-2 space-y-4">
        {queue.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">Nenhum consulente na fila</p>
          </div>
        ) : (
          queue.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-purple-600">#{entry.sequence}</span>
                    <h3 className="text-lg font-semibold text-gray-900">{entry.consultantName}</h3>
                  </div>
                  {entry.consultantPhone && (
                    <p className="text-sm text-gray-500 mt-1">{entry.consultantPhone}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Entrou: {new Date(entry.createdAt).toLocaleTimeString('pt-BR')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(entry.status)}`}>
                  {getStatusLabel(entry.status)}
                </span>
              </div>

              {entry.assignedMedium && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Médium:</strong> {entry.assignedMedium.name}
                    {entry.assignedMedium.function && ` (${entry.assignedMedium.function.name})`}
                  </p>
                  {entry.startedAt && (
                    <p className="text-xs text-blue-700 mt-1">
                      Início: {new Date(entry.startedAt).toLocaleTimeString('pt-BR')}
                    </p>
                  )}
                </div>
              )}

              {entry.status === 'aguardando' && mediums.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {mediums.map((medium) => (
                    <button
                      key={medium.id}
                      onClick={() => handleAssignMedium(entry.id, medium.id)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                    >
                      Atribuir: {medium.name}
                    </button>
                  ))}
                </div>
              )}

              {entry.status === 'em_atendimento' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus(entry.id, 'atendido')}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                  >
                    Marcar como Atendido
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(entry.id, 'cancelado')}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
