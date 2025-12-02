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
  const [queue] = useState(initialQueue)
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
        return 'bg-gray-200 text-black'
      case 'em_atendimento':
        return 'bg-black text-white'
      case 'atendido':
        return 'bg-gray-800 text-white'
      case 'cancelado':
        return 'bg-white text-black border-2 border-black'
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

  const inputClass = "w-full px-4 py-3 bg-white border-2 border-gray-300 text-black placeholder-gray-400 focus:border-black focus:ring-0 transition-colors"
  const labelClass = "block text-sm font-bold text-black mb-2 uppercase tracking-wide"

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Formulário de Adicionar */}
      <div className="lg:col-span-1">
        <div className="bg-white border-2 border-black p-6 sticky top-6">
          <h2 className="text-xl font-bold text-black mb-6 uppercase tracking-wide">Adicionar Consulente</h2>
          <form onSubmit={handleAddToQueue} className="space-y-6">
            <div>
              <label className={labelClass}>
                Nome *
              </label>
              <input
                type="text"
                value={consultantName}
                onChange={(e) => setConsultantName(e.target.value)}
                required
                className={inputClass}
                placeholder="Nome do consulente"
              />
            </div>
            <div>
              <label className={labelClass}>
                Telefone
              </label>
              <input
                type="tel"
                value={consultantPhone}
                onChange={(e) => setConsultantPhone(e.target.value)}
                className={inputClass}
                placeholder="(00) 00000-0000"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-black text-white font-bold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Adicionando...' : 'Adicionar à Fila'}
            </button>
          </form>

          {mediums.length > 0 && (
            <div className="mt-8 pt-6 border-t-2 border-gray-300">
              <h3 className="text-sm font-bold text-black mb-4 uppercase tracking-wide">Médiuns Presentes</h3>
              <div className="space-y-2">
                {mediums.map((medium) => (
                  <div key={medium.id} className="text-sm text-gray-600 font-medium">
                    • {medium.name}
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
      <div className="lg:col-span-2 space-y-6">
        {queue.length === 0 ? (
          <div className="bg-white border-2 border-gray-300 p-12 text-center">
            <p className="text-gray-600 font-medium">Nenhum consulente na fila</p>
          </div>
        ) : (
          queue.map((entry) => (
            <div
              key={entry.id}
              className="bg-white border-2 border-black p-6"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-3xl font-black text-black">#{entry.sequence}</span>
                    <h3 className="text-xl font-bold text-black">{entry.consultantName}</h3>
                  </div>
                  {entry.consultantPhone && (
                    <p className="text-sm text-gray-600 font-medium">{entry.consultantPhone}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2 uppercase tracking-wide">
                    Entrou: {new Date(entry.createdAt).toLocaleTimeString('pt-BR')}
                  </p>
                </div>
                <span className={`px-4 py-2 text-xs font-bold uppercase tracking-wider ${getStatusColor(entry.status)}`}>
                  {getStatusLabel(entry.status)}
                </span>
              </div>

              {entry.assignedMedium && (
                <div className="mb-6 p-4 bg-gray-100 border-l-4 border-black">
                  <p className="text-sm text-black font-bold mb-1">
                    Médium: {entry.assignedMedium.name}
                    {entry.assignedMedium.function && ` (${entry.assignedMedium.function.name})`}
                  </p>
                  {entry.startedAt && (
                    <p className="text-xs text-gray-600 uppercase tracking-wide">
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
                      className="px-4 py-2 bg-white border-2 border-black text-black text-sm font-bold hover:bg-black hover:text-white transition-colors"
                    >
                      {medium.name}
                    </button>
                  ))}
                </div>
              )}

              {entry.status === 'em_atendimento' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdateStatus(entry.id, 'atendido')}
                    className="px-6 py-3 bg-black text-white text-sm font-bold hover:bg-gray-800 transition-colors"
                  >
                    Concluir Atendimento
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(entry.id, 'cancelado')}
                    className="px-6 py-3 bg-white border-2 border-black text-black text-sm font-bold hover:bg-gray-100 transition-colors"
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
