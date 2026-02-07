'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function getProjects() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Query projects directly - RLS ensures only member projects are returned
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getProjects error:', error)
    return []
  }
  return data ?? []
}

export async function createProject(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('projects')
    .insert({
      name: formData.get('name') as string,
      description: (formData.get('description') as string) || null,
      owner_id: user.id,
    })

  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function getProject(projectId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*, project_members(*, profile:profiles(*))')
    .eq('id', projectId)
    .single()

  if (error) return null
  return data
}
