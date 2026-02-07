'use client'

import { useState } from 'react'
import { Menu, LogOut } from 'lucide-react'
import { User } from '@supabase/supabase-js'
import { signOut } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Database } from '@/lib/types/database'

type Project = Database['public']['Tables']['projects']['Row']

interface HeaderProps {
  user: User
  projects: Project[]
}

export function Header({ user, projects }: HeaderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const initials = (user.user_metadata?.full_name as string || user.email || '?')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <>
      <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="size-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <div className="flex-1" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar size="sm">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user.user_metadata?.full_name || 'User'}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <form action={signOut}>
              <DropdownMenuItem asChild>
                <button type="submit" className="w-full cursor-pointer">
                  <LogOut className="size-4" />
                  Sign out
                </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0" showCloseButton={false}>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Sidebar user={user} projects={projects} />
        </SheetContent>
      </Sheet>
    </>
  )
}
