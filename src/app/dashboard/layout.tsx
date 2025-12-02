import { getSession } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={session} />
      <div className="flex-1 flex flex-col">
        <Header user={session} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
