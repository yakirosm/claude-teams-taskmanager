'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createProject } from '@/actions/projects'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface CreateProjectDialogProps {
  children: React.ReactNode
}

export function CreateProjectDialog({ children }: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createProject(formData)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Project created')
        setOpen(false)
        router.refresh()
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
          <DialogDescription>
            Add a new project to organize your tasks.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="project-name">Name</Label>
              <Input
                id="project-name"
                name="name"
                placeholder="My Project"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="project-description">Description</Label>
              <Textarea
                id="project-description"
                name="description"
                placeholder="What is this project about?"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
