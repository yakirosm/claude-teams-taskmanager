import Link from 'next/link'
import { ArrowRight, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Database } from '@/lib/types/database'

type Project = Database['public']['Tables']['projects']['Row']

interface ProjectCardProps {
  project: Project & { project_members?: { user_id: string }[] }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const memberCount = project.project_members?.length ?? 0

  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="transition-colors hover:border-primary/50 group">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="truncate">{project.name}</span>
            <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100 text-muted-foreground" />
          </CardTitle>
          {project.description && (
            <CardDescription className="line-clamp-2">
              {project.description}
            </CardDescription>
          )}
        </CardHeader>
        {memberCount > 0 && (
          <CardContent>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="size-3.5" />
              <span>{memberCount} {memberCount === 1 ? 'member' : 'members'}</span>
            </div>
          </CardContent>
        )}
      </Card>
    </Link>
  )
}
