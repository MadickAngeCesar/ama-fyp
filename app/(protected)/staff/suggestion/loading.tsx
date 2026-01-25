import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-4">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-md" />
          <div>
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Skeleton className="h-9 w-20" />
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-3">
            <CardContent className="p-0">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <div>
                  <Skeleton className="h-5 w-8" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <Card className="p-4">
            <CardHeader className="p-0">
              <Skeleton className="h-5 w-16" />
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              <div>
                <Skeleton className="h-4 w-12 mb-1" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex flex-row justify-between">
                <div>
                  <Skeleton className="h-4 w-12 mb-1" />
                  <Skeleton className="h-8 w-20" />
                </div>
                <div>
                  <Skeleton className="h-4 w-12 mb-1" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
              <div className="flex flex-row justify-between">
                <div>
                  <Skeleton className="h-4 w-12 mb-1" />
                  <Skeleton className="h-8 w-20" />
                </div>
                <div>
                  <Skeleton className="h-4 w-12 mb-1" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        </aside>

        {/* Table */}
        <main className="lg:col-span-3">
          <Card className="p-4">
            <CardHeader className="p-0 pb-4">
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="p-0">
              {/* Table Header */}
              <div className="hidden md:block border-b pb-2 mb-4">
                <div className="grid grid-cols-5 gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              {/* Table Rows */}
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="hidden md:block">
                    <div className="grid grid-cols-5 gap-4 p-3 border rounded-lg">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-4 w-8 text-center" />
                      <Skeleton className="h-4 w-16" />
                      <div className="flex gap-1">
                        <Skeleton className="h-8 w-12" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </div>
                  </div>
                ))}
                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-7 w-20" />
                        </div>
                        <Skeleton className="h-3 w-full" />
                        <div className="flex gap-2">
                          <Skeleton className="h-8 w-12" />
                          <Skeleton className="h-8 w-16" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}