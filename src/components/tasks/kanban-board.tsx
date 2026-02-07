'use client'

import { useState, useCallback } from 'react'
import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import { useRealtimeTasks } from '@/hooks/use-realtime-tasks'
import { updateTaskPosition } from '@/actions/tasks'
import { KanbanColumn } from './kanban-column'
import { CreateTaskDialog } from './create-task-dialog'
import { Database } from '@/lib/types/database'

type Task = Database['public']['Tables']['tasks']['Row'] & {
  assignee?: Database['public']['Tables']['profiles']['Row'] | null
  creator?: Database['public']['Tables']['profiles']['Row'] | null
}

type Member = Database['public']['Tables']['project_members']['Row'] & {
  profile: Database['public']['Tables']['profiles']['Row'] | null
}

const COLUMNS = ['todo', 'in_progress', 'done'] as const

export function KanbanBoard({
  projectId,
  initialTasks,
  members,
}: {
  projectId: string
  initialTasks: Task[]
  members: Member[]
}) {
  const { tasks, setTasks } = useRealtimeTasks(projectId, initialTasks)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const tasksByStatus = COLUMNS.reduce((acc, status) => {
    acc[status] = tasks
      .filter((t) => t.status === status)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    return acc
  }, {} as Record<string, Task[]>)

  const onDragEnd = useCallback(
    async (result: DropResult) => {
      const { destination, source, draggableId } = result

      if (!destination) return
      if (destination.droppableId === source.droppableId && destination.index === source.index) return

      const task = tasks.find((t) => t.id === draggableId)
      if (!task) return

      // Optimistic update
      const newStatus = destination.droppableId as Task['status']
      const newPosition = destination.index

      setTasks((prev) => {
        const updated = prev.map((t) => {
          if (t.id === draggableId) {
            return { ...t, status: newStatus, position: newPosition }
          }
          return t
        })
        return updated
      })

      await updateTaskPosition(draggableId, newStatus, newPosition)
    },
    [tasks, setTasks]
  )

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={tasksByStatus[status]}
              members={members}
              onAddTask={() => setCreateDialogOpen(true)}
            />
          ))}
        </div>
      </DragDropContext>
      <CreateTaskDialog
        projectId={projectId}
        members={members}
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  )
}
