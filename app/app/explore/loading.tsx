import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div>
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <h1>
              <Skeleton className="h-10 w-80 max-w-full" />
            </h1>
            <Skeleton className="mt-1 h-4 w-90 max-w-full sm:w-100" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        {/* Filters */}
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center">
            {/* Search Filter */}
            <Skeleton className="h-9 flex-1 bg-card" />

            {/* Clear Filters */}
            <Skeleton className="h-9 bg-card sm:ml-5 sm:w-30" />
          </div>

          {/* Results Count */}
          <div className="flex items-baseline justify-end gap-2 whitespace-nowrap">
            <Skeleton className="h-10 w-10 bg-card" />
            <Skeleton className="h-5 w-15 bg-card" />
          </div>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="flex w-full flex-col rounded-lg bg-card p-5">
              {/* Title */}
              <Skeleton className="h-6 w-80" />

              {/* Content */}
              <div className="mt-2 mb-4 space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>

              {/* Details */}
              <div className="flex flex-col gap-1 text-sm text-muted-foreground sm:grid sm:grid-cols-2 sm:gap-2">
                <div className="flex items-center">
                  <Skeleton className="h-5 w-50" />
                </div>

                <div className="flex items-center">
                  <Skeleton className="h-5 w-50" />
                </div>
              </div>

              {/* Actions */}
              <Skeleton className="mt-2 h-10 w-full" />
            </Skeleton>
          ))}
        </div>
      </main>
    </div>
  )
}
