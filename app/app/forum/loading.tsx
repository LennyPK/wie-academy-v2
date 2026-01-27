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
          <div className="flex-1 space-y-2">
            {/* Search Filter */}
            <Skeleton className="h-9 flex-1 bg-card" />

            <div className="flex flex-col gap-2 sm:flex-row">
              {/* Status Status Filter */}
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
        <div className="flex flex-col gap-5 sm:grid sm:grid-cols-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="flex w-full flex-col rounded-lg bg-card p-5">
              {/* Category Badge and Timestamp */}
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                <Skeleton className="h-5 w-30" />
                <Skeleton className="h-5 w-40" />
              </div>

              {/* Title */}
              <div className="mt-4 flex items-start gap-2 sm:items-center">
                <Skeleton className="h-8 w-80" />
              </div>

              {/* Author */}
              <div className="mt-2">
                <Skeleton className="h-4 w-40" />
              </div>

              {/* Content */}
              <div className="mt-4 mb-2 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />

                {/* Interaction Icons */}
                <div className="flex flex-row gap-2">
                  <Skeleton className="h-5 w-10" />
                  <Skeleton className="h-5 w-10" />
                  <Skeleton className="h-5 w-10" />
                </div>
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
