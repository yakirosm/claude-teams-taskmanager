import { Skeleton } from '@/components/ui/skeleton'

export default function ProjectLoading() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {Array.from({ length: 3 }).map((_, colIdx) => (
          <div key={colIdx} className="flex w-80 shrink-0 flex-col gap-3 rounded-lg bg-muted/40 p-3">
            <div className="flex items-center gap-2">
              <Skeleton className="size-2 rounded-full" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-6 rounded-full" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: colIdx === 0 ? 3 : colIdx === 1 ? 2 : 1 }).map((_, cardIdx) => (
                <div key={cardIdx} className="rounded-xl border bg-card p-3 space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-14 rounded-full" />
                    <Skeleton className="size-6 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
