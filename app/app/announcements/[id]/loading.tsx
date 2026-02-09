import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="py-4">
          <Skeleton className="h-9 w-30 bg-card" />
        </div>
        {/* <div> */}
        <Skeleton className="flex w-full flex-col gap-2 rounded-lg bg-card p-5">
          {/* Category Badge and Timestamp */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
            <Skeleton className="h-5 w-30" />
            <Skeleton className="h-5 w-40" />
          </div>

          {/* Title */}
          <div className="mt-2 flex items-start gap-2 sm:items-center">
            <Skeleton className="h-8 w-80" />
          </div>

          {/* Author */}
          <div className="mt-2 flex items-center gap-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-40" />
          </div>

          {/* Actions */}
          <Skeleton className="my-4 h-17 w-full" />

          {/* Content */}
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}

            {/* Image placeholder */}
            <div className="flex flex-row gap-2">
              <Skeleton className="h-100 w-100" />
              <div className="flex flex-1 flex-col gap-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </Skeleton>

        {/* Footer */}
        <footer className="flex flex-col gap-2 py-5">
          {/* Regions */}
          <div>
            <Skeleton className="h-4 w-30 bg-card" />

            {/* Pills */}
            <div className="flex gap-2 py-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-20 bg-card" />
              ))}
            </div>
          </div>

          {/* Schools */}
          <div>
            <Skeleton className="h-4 w-30 bg-card" />

            {/* Pills */}
            <div className="flex gap-2 py-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-20 bg-card" />
              ))}
            </div>
          </div>

          {/* Year Levels */}
          <div>
            <Skeleton className="h-4 w-30 bg-card" />

            {/* Pills */}
            <div className="flex gap-2 py-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-20 bg-card" />
              ))}
            </div>
          </div>
        </footer>
        {/* </div> */}
      </main>
    </div>
  )
}
