import { getOpenGiras } from '@/app/actions/queue'
import Link from 'next/link'

export default async function DashboardPage() {
  const result = await getOpenGiras()
  const giras = result.success ? result.giras : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Giras Abertas</h1>
        <p className="text-gray-600 mt-1">Selecione uma gira para gerenciar a fila de atendimento</p>
      </div>

      {giras.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">Nenhuma gira aberta no momento</p>
          <p className="text-gray-400 text-sm mt-2">
            Um administrador precisa abrir uma gira para iniciar os atendimentos
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {giras.map((gira) => (
            <Link
              key={gira.id}
              href={`/dashboard/gira/${gira.id}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border-l-4 border-purple-600"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {gira.giraType.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(gira.openedAt).toLocaleString('pt-BR')}
                  </p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Aberta
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-gray-500">Médiuns</p>
                    <p className="font-semibold text-gray-900">{gira._count.mediums}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Na fila</p>
                    <p className="font-semibold text-gray-900">{gira._count.queueEntries}</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
