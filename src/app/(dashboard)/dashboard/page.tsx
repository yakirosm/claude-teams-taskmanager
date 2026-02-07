import { Plus } from 'lucide-react'
import { getProjects } from '@/actions/projects'
import { Button } from '@/components/ui/button'
import { ProjectCard } from '@/components/dashboard/project-card'
import { CreateProjectDialog } from '@/components/dashboard/create-project-dialog'

export default async function DashboardPage() {
  const projects = await getProjects()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here are your projects.
          </p>
        </div>
        <CreateProjectDialog>
          <Button>
            <Plus className="size-4" />
            New Project
          </Button>
        </CreateProjectDialog>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <h2 className="text-lg font-semibold">No projects yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first project to get started.
          </p>
          <CreateProjectDialog>
            <Button className="mt-4">
              <Plus className="size-4" />
              Create Project
            </Button>
          </CreateProjectDialog>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
