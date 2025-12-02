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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Gerenciar Gira</h1>
          <p className="text-gray-600 mt-2">Fila de atendimento em tempo real • Auto-refresh 5s</p>
        </div>
        <div className="bg-black text-white px-6 py-3 font-bold text-lg">
          {queue.length} NA FILA
        </div>
      </div>

      <GiraQueue giraId={giraId} initialQueue={queue} mediums={mediums} />
    </div>
  )
}
