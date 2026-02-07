'use client'

import { useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TaskDetailSheet } from './task-detail-sheet'
import { Database } from '@/lib/types/database'

type Task = Database['public']['Tables']['tasks']['Row'] & {
  assignee?: Database['public']['Tables']['profiles']['Row'] | null
  creator?: Database['public']['Tables']['profiles']['Row'] | null
}

type Member = Database['public']['Tables']['project_members']['Row'] & {
  profile: Database['public']['Tables']['profiles']['Row'] | null
}

const priorityConfig = {
  high: { label: 'High', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  medium: { label: 'Medium', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  low: { label: 'Low', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
}

function getInitials(name: string | null): string {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function TaskCard({
  task,
  index,
  members,
}: {
  task: Task
  index: number
  members: Member[]
}) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const priority = priorityConfig[task.priority]

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => setSheetOpen(true)}
          >
            <Card
              className={`cursor-pointer gap-3 p-3 transition-shadow hover:shadow-md ${
                snapshot.isDragging ? 'shadow-lg rotate-2' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium leading-snug">{task.title}</p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <Badge variant="outline" className={priority.className}>
                  {priority.label}
                </Badge>
                {task.assignee && (
                  <Avatar size="sm">
                    <AvatarImage src={task.assignee.avatar_url ?? undefined} />
                    <AvatarFallback>{getInitials(task.assignee.full_name)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </Card>
          </div>
        )}
      </Draggable>
      <TaskDetailSheet
        task={task}
        members={members}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  )
}
