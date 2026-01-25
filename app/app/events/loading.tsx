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
            <Skeleton className="mt-1 h-4 w-100 max-w-full" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        {/* Filters */}
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 space-y-2">
            {/* Search Filter */}
            <Skeleton className="h-9 flex-1 bg-card" />

            <div className="flex flex-col gap-2 sm:flex-row">
              {/* Status Status Filter */}
              <Skeleton className="h-9 w-full bg-card sm:flex-1" />

              {/* Category Filter */}
              <Skeleton className="h-9 w-full bg-card sm:flex-1" />

              {/* Sorting Filter */}
              <Skeleton className="h-9 w-full bg-card sm:flex-1" />

              {/* Clear Filters */}
              <Skeleton className="h-9 bg-card sm:ml-5 sm:w-30" />
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-baseline justify-end gap-2 whitespace-nowrap">
            <Skeleton className="h-10 w-10 bg-card" />
            <Skeleton className="h-5 w-15 bg-card" />
          </div>
        </div>

        {/* List */}
        <div className="flex flex-col gap-6 sm:grid sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="flex w-full flex-col rounded-lg bg-card p-5">
              {/* Category Badge and Timestamp */}
              <Skeleton className="h-5 w-30" />

              {/* Title */}
              <div className="mt-2 flex items-start gap-2 sm:items-center">
                <Skeleton className="h-8 w-80" />
              </div>

              {/* Content */}
              <div className="mt-4 mb-8 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>

              {/* Details */}
              <div className="flex flex-1 flex-col gap-2 overflow-hidden">
                <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:grid sm:grid-cols-2 sm:gap-0 sm:text-base">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-50" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-50" />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground sm:text-base">
                  <Skeleton className="h-5 w-50" />
                </div>

                {/* Seperator */}
                <Skeleton className="my-3 h-0.5 w-full" />

                {/* User Count */}
                <Skeleton className="h-5 w-50" />

                <Skeleton className="mt-2 h-2 w-full" />

                {/* Actions */}
                <Skeleton className="mt-2 h-10 w-full" />
              </div>
            </Skeleton>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          {/* Left Arrow */}
          <Skeleton className="h-10 w-10 bg-card" />

          <div className="flex -space-x-px">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-10 bg-card" />
            ))}
          </div>

          {/* Right Arrow */}
          <Skeleton className="h-10 w-10 bg-card" />
        </div>
      </main>
    </div>
  )
}
