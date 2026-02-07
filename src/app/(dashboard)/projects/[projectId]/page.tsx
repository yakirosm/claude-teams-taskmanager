import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getTasks, getProjectMembers } from '@/actions/tasks'
import { KanbanBoard } from '@/components/tasks/kanban-board'
import { Button } from '@/components/ui/button'
import { SettingsIcon } from 'lucide-react'
import Link from 'next/link'

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (!project) redirect('/dashboard')

  const [tasks, members] = await Promise.all([
    getTasks(projectId),
    getProjectMembers(projectId),
  ])

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          {project.description && (
            <p className="text-muted-foreground mt-1 text-sm">{project.description}</p>
          )}
        </div>
        <Link href={`/projects/${projectId}/settings`}>
          <Button variant="outline" size="sm">
            <SettingsIcon className="size-4" />
            Settings
          </Button>
        </Link>
      </div>
      <KanbanBoard projectId={projectId} initialTasks={tasks} members={members} />
    </div>
  )
}
