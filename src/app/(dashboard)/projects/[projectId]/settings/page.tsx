import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProjectMembers } from '@/actions/tasks'
import { MemberList } from '@/components/projects/member-list'
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'

export default async function ProjectSettingsPage({
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

  const members = await getProjectMembers(projectId)

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Link href={`/projects/${projectId}`}>
          <Button variant="ghost" size="icon-sm">
            <ArrowLeftIcon className="size-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Project Settings</h1>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">Project Details</h2>
          <div className="mt-3 space-y-2">
            <div>
              <span className="text-muted-foreground text-sm">Name</span>
              <p className="text-sm font-medium">{project.name}</p>
            </div>
            {project.description && (
              <div>
                <span className="text-muted-foreground text-sm">Description</span>
                <p className="text-sm">{project.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">Members</h2>
          <div className="mt-3">
            <MemberList members={members} />
          </div>
        </div>
      </div>
    </div>
  )
}
