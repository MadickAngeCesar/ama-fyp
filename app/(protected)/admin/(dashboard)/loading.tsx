import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-8 w-24" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-24 w-full col-span-1" />
        <Skeleton className="h-24 w-full col-span-1" />
        <Skeleton className="h-24 w-full col-span-1" />
      </div>

      <div>
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}