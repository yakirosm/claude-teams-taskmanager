'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/types/database'

type Task = Database['public']['Tables']['tasks']['Row'] & {
  assignee?: Database['public']['Tables']['profiles']['Row'] | null
  creator?: Database['public']['Tables']['profiles']['Row'] | null
}

export function useRealtimeTasks(projectId: string, initialTasks: Task[]) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const supabase = createClient()

  useEffect(() => {
    setTasks(initialTasks)
  }, [initialTasks])

  useEffect(() => {
    const channel = supabase
      .channel(`tasks:${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `project_id=eq.${projectId}`,
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const { data } = await supabase
              .from('tasks')
              .select('*, assignee:profiles!tasks_assignee_id_fkey(*), creator:profiles!tasks_created_by_fkey(*)')
              .eq('id', (payload.new as Record<string, string>).id)
              .single()
            if (data) {
              setTasks(prev => [...prev, data as Task])
            }
          } else if (payload.eventType === 'UPDATE') {
            const { data } = await supabase
              .from('tasks')
              .select('*, assignee:profiles!tasks_assignee_id_fkey(*), creator:profiles!tasks_created_by_fkey(*)')
              .eq('id', (payload.new as Record<string, string>).id)
              .single()
            if (data) {
              setTasks(prev => prev.map(t => t.id === data.id ? data as Task : t))
            }
          } else if (payload.eventType === 'DELETE') {
            setTasks(prev => prev.filter(t => t.id !== (payload.old as Record<string, string>).id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [projectId, supabase])

  return { tasks, setTasks }
}
