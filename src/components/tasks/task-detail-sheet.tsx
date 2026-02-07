'use client'

import { useState } from 'react'
import { updateTask, deleteTask } from '@/actions/tasks'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Trash2Icon, PencilIcon } from 'lucide-react'
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

const statusLabels: Record<string, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
}

function getInitials(name: string | null): string {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function TaskDetailSheet({
  task,
  members,
  open,
  onOpenChange,
}: {
  task: Task
  members: Member[]
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description ?? '')
  const [priority, setPriority] = useState(task.priority)
  const [status, setStatus] = useState(task.status)
  const [assigneeId, setAssigneeId] = useState(task.assignee_id ?? '')

  function resetForm() {
    setTitle(task.title)
    setDescription(task.description ?? '')
    setPriority(task.priority)
    setStatus(task.status)
    setAssigneeId(task.assignee_id ?? '')
    setEditing(false)
  }

  async function handleSave() {
    setLoading(true)
    const result = await updateTask(task.id, {
      title,
      description: description || null,
      priority,
      status,
      assignee_id: assigneeId || null,
    })
    setLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Task updated')
      setEditing(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this task?')) return
    setLoading(true)
    const result = await deleteTask(task.id, task.project_id)
    setLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Task deleted')
      onOpenChange(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) resetForm() }}>
      <SheetContent side="right" className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{editing ? 'Edit Task' : 'Task Details'}</SheetTitle>
          <SheetDescription>
            Created {new Date(task.created_at).toLocaleDateString()}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 px-4">
          {editing ? (
            <>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as Task['status'])}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={priority} onValueChange={(v) => setPriority(v as Task['priority'])}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Assignee</Label>
                <Select value={assigneeId} onValueChange={setAssigneeId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((m) => (
                      <SelectItem key={m.user_id} value={m.user_id}>
                        {m.profile?.full_name || 'Unknown'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-lg font-semibold">{task.title}</h3>
                {task.description && (
                  <p className="text-muted-foreground mt-1 text-sm">{task.description}</p>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Status</span>
                  <Badge variant="secondary">{statusLabels[task.status]}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Priority</span>
                  <Badge variant="outline" className={priorityConfig[task.priority].className}>
                    {priorityConfig[task.priority].label}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Assignee</span>
                  {task.assignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar size="sm">
                        <AvatarImage src={task.assignee.avatar_url ?? undefined} />
                        <AvatarFallback>{getInitials(task.assignee.full_name)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{task.assignee.full_name}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">Unassigned</span>
                  )}
                </div>
                {task.creator && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Created by</span>
                    <span className="text-sm">{task.creator.full_name}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Updated</span>
                  <span className="text-sm">{new Date(task.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </>
          )}
        </div>

        <SheetFooter>
          {editing ? (
            <>
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </>
          ) : (
            <>
              <Button variant="destructive" size="sm" onClick={handleDelete} disabled={loading}>
                <Trash2Icon className="size-4" />
                Delete
              </Button>
              <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                <PencilIcon className="size-4" />
                Edit
              </Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
