import { getSession } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import AdminForms from '@/components/AdminForms'

export default async function AdminPage() {
  const session = await getSession()

  if (!session || session.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Administração</h1>
        <p className="text-gray-600 mt-1">Gerenciar funções, tipos de gira, usuários e giras</p>
      </div>

      <AdminForms />
    </div>
  )
}
