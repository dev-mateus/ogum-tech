import { getOpenGiras } from '@/app/actions/queue'
import Link from 'next/link'

export default async function DashboardPage() {
  const result = await getOpenGiras()
  const giras = result.success ? result.giras : []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black">Giras Abertas</h1>
        <p className="text-gray-600 mt-2">Selecione uma gira para gerenciar a fila de atendimento</p>
      </div>

      {giras.length === 0 ? (
        <div className="bg-white border-2 border-gray-300 p-12 text-center">
          <p className="text-gray-600 text-lg font-medium">Nenhuma gira aberta no momento</p>
          <p className="text-gray-500 text-sm mt-2">
            Um administrador precisa abrir uma gira para iniciar os atendimentos
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {giras.map((gira) => (
            <Link
              key={gira.id}
              href={`/dashboard/gira/${gira.id}`}
              className="bg-white border-2 border-gray-300 hover:border-black transition-colors p-6 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-black group-hover:underline">
                    {gira.giraType.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(gira.openedAt).toLocaleString('pt-BR')}
                  </p>
                </div>
                <span className="bg-black text-white text-xs font-bold px-3 py-1 uppercase tracking-wide">
                  Aberta
                </span>
              </div>

              <div className="flex items-center gap-6 text-sm border-t-2 border-gray-200 pt-4">
                <div>
                  <p className="text-gray-500 font-medium">Médiuns</p>
                  <p className="font-bold text-black text-xl">{gira._count.mediums}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">Na fila</p>
                  <p className="font-bold text-black text-xl">{gira._count.queueEntries}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
