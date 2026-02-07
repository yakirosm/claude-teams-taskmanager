'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { Database } from '@/lib/types/database'

export async function getTasks(projectId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tasks')
    .select('*, assignee:profiles!tasks_assignee_id_fkey(*), creator:profiles!tasks_created_by_fkey(*)')
    .eq('project_id', projectId)
    .order('position', { ascending: true })

  if (error) return []
  return data ?? []
}

export async function createTask(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const projectId = formData.get('projectId') as string
  const { error } = await supabase
    .from('tasks')
    .insert({
      project_id: projectId,
      title: formData.get('title') as string,
      description: (formData.get('description') as string) || null,
      priority: (formData.get('priority') as 'low' | 'medium' | 'high') || 'medium',
      assignee_id: (formData.get('assigneeId') as string) || null,
      created_by: user.id,
      status: 'todo',
    })

  if (error) return { error: error.message }
  revalidatePath(`/projects/${projectId}`)
  return { success: true }
}

export async function updateTask(taskId: string, updates: Partial<Database['public']['Tables']['tasks']['Update']>) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tasks')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', taskId)
    .select('project_id')
    .single()

  if (error) return { error: error.message }
  if (data) revalidatePath(`/projects/${data.project_id}`)
  return { success: true }
}

export async function deleteTask(taskId: string, projectId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)

  if (error) return { error: error.message }
  revalidatePath(`/projects/${projectId}`)
  return { success: true }
}

export async function updateTaskPosition(taskId: string, status: 'todo' | 'in_progress' | 'done', position: number) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tasks')
    .update({ status, position, updated_at: new Date().toISOString() })
    .eq('id', taskId)
    .select('project_id')
    .single()

  if (error) return { error: error.message }
  if (data) revalidatePath(`/projects/${data.project_id}`)
  return { success: true }
}

export async function getProjectMembers(projectId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('project_members')
    .select('*, profile:profiles(*)')
    .eq('project_id', projectId)

  if (error) return []
  return data ?? []
}
