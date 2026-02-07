'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, LogOut, Plus, FolderKanban } from 'lucide-react'
import { User } from '@supabase/supabase-js'
import { signOut } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { CreateProjectDialog } from '@/components/dashboard/create-project-dialog'
import { cn } from '@/lib/utils'
import { Database } from '@/lib/types/database'

type Project = Database['public']['Tables']['projects']['Row']

interface SidebarProps {
  user: User
  projects: Project[]
}

export function Sidebar({ user, projects }: SidebarProps) {
  const pathname = usePathname()

  const initials = (user.user_metadata?.full_name as string || user.email || '?')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex h-14 items-center px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <FolderKanban className="size-5" />
          <span>Task Manager</span>
        </Link>
      </div>
      <Separator />
      <nav className="flex-1 space-y-1 px-2 py-2">
        <Link
          href="/dashboard"
          className={cn(
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
            pathname === '/dashboard' && 'bg-accent text-accent-foreground'
          )}
        >
          <LayoutDashboard className="size-4" />
          Dashboard
        </Link>
        <Separator className="my-3" />
        <div className="flex items-center justify-between px-3 py-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Projects
          </span>
          <CreateProjectDialog>
            <Button variant="ghost" size="icon-xs">
              <Plus className="size-3.5" />
            </Button>
          </CreateProjectDialog>
        </div>
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
              pathname === `/projects/${project.id}` && 'bg-accent text-accent-foreground'
            )}
          >
            <FolderKanban className="size-4" />
            <span className="truncate">{project.name}</span>
          </Link>
        ))}
        {projects.length === 0 && (
          <p className="px-3 py-2 text-sm text-muted-foreground">
            No projects yet
          </p>
        )}
      </nav>
      <Separator />
      <div className="flex items-center gap-3 p-4">
        <Avatar size="sm">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium">
            {user.user_metadata?.full_name || user.email}
          </p>
        </div>
        <form action={signOut}>
          <Button variant="ghost" size="icon-xs" type="submit" title="Sign out">
            <LogOut className="size-3.5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
