import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="flex flex-col h-[calc(100vh-4rem)] max-w-2xl mx-auto bg-background rounded-lg shadow-lg border mt-6">
      {/* Chat Header */}
      <div className="p-4 border-b">
        <Skeleton className="h-6 w-32" />
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-xs p-3 rounded-lg ${i % 2 === 0 ? 'bg-muted' : 'bg-primary'}`}>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Skeleton className="flex-1 h-10" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    </main>
  );
}