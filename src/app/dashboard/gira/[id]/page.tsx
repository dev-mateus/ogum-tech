import { getGiraMediums } from '@/app/actions/admin'
import { getGiraQueue } from '@/app/actions/queue'
import { notFound } from 'next/navigation'
import GiraQueue from '@/components/GiraQueue'

export default async function GiraPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const giraId = parseInt(id)

  const [queueResult, mediumsResult] = await Promise.all([
    getGiraQueue(giraId),
    getGiraMediums(giraId),
  ])

  if (!queueResult.success) {
    notFound()
  }

  const queue = queueResult.queue || []
  const mediums = mediumsResult.success ? mediumsResult.mediums || [] : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Gira</h1>
          <p className="text-gray-600 mt-1">Fila de atendimento em tempo real</p>
        </div>
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium">
          {queue.length} na fila
        </div>
      </div>

      <GiraQueue giraId={giraId} initialQueue={queue} mediums={mediums} />
    </div>
  )
}
