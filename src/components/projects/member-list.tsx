'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Database } from '@/lib/types/database'

type Member = Database['public']['Tables']['project_members']['Row'] & {
  profile: Database['public']['Tables']['profiles']['Row'] | null
}

function getInitials(name: string | null): string {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const roleColors: Record<string, string> = {
  owner: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  admin: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  member: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
}

export function MemberList({ members }: { members: Member[] }) {
  if (members.length === 0) {
    return <p className="text-muted-foreground text-sm">No members found.</p>
  }

  return (
    <div className="space-y-2">
      {members.map((member) => (
        <div
          key={member.user_id}
          className="flex items-center gap-3 rounded-lg border p-3"
        >
          <Avatar>
            <AvatarImage src={member.profile?.avatar_url ?? undefined} />
            <AvatarFallback>{getInitials(member.profile?.full_name ?? null)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {member.profile?.full_name || 'Unknown'}
            </p>
            <p className="text-muted-foreground text-xs truncate">{member.user_id}</p>
          </div>
          <Badge variant="outline" className={roleColors[member.role] ?? ''}>
            {member.role}
          </Badge>
        </div>
      ))}
    </div>
  )
}
