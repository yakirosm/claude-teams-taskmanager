import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProjects } from '@/actions/projects'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const projects = await getProjects()

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r bg-background lg:block">
        <Sidebar user={user} projects={projects} />
      </aside>
      <div className="flex flex-1 flex-col">
        <Header user={user} projects={projects} />
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
