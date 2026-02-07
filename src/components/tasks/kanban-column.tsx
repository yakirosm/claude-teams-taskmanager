'use client'

import { Droppable } from '@hello-pangea/dnd'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TaskCard } from './task-card'
import { Database } from '@/lib/types/database'

type Task = Database['public']['Tables']['tasks']['Row'] & {
  assignee?: Database['public']['Tables']['profiles']['Row'] | null
  creator?: Database['public']['Tables']['profiles']['Row'] | null
}

type Member = Database['public']['Tables']['project_members']['Row'] & {
  profile: Database['public']['Tables']['profiles']['Row'] | null
}

const columnConfig: Record<string, { title: string; bg: string; accent: string }> = {
  todo: { title: 'To Do', bg: 'bg-muted/40', accent: 'bg-slate-500' },
  in_progress: { title: 'In Progress', bg: 'bg-blue-50/50 dark:bg-blue-950/20', accent: 'bg-blue-500' },
  done: { title: 'Done', bg: 'bg-green-50/50 dark:bg-green-950/20', accent: 'bg-green-500' },
}

export function KanbanColumn({
  status,
  tasks,
  members,
  onAddTask,
}: {
  status: string
  tasks: Task[]
  members: Member[]
  onAddTask: () => void
}) {
  const config = columnConfig[status] ?? { title: status, bg: 'bg-muted/40', accent: 'bg-gray-500' }

  return (
    <div className={`flex w-80 shrink-0 flex-col rounded-lg ${config.bg}`}>
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <div className={`size-2 rounded-full ${config.accent}`} />
          <h3 className="text-sm font-semibold">{config.title}</h3>
          <Badge variant="secondary" className="text-xs">
            {tasks.length}
          </Badge>
        </div>
        <Button variant="ghost" size="icon-xs" onClick={onAddTask}>
          <PlusIcon className="size-4" />
        </Button>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex min-h-[200px] flex-1 flex-col gap-2 p-2 transition-colors ${
              snapshot.isDraggingOver ? 'bg-accent/30 rounded-md' : ''
            }`}
          >
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <p className="text-muted-foreground py-8 text-center text-sm">No tasks</p>
            )}
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} members={members} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
