import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Back button */}
        <div className="py-4">
          <Skeleton className="h-9 w-30 bg-card" />
        </div>

        <div className="flex flex-col gap-4">
          {/* Quiz details card */}
          <Skeleton className="flex w-full flex-col gap-2 rounded-lg bg-card p-5">
            <Skeleton className="h-6 w-80" />

            {/* Content */}
            <div className="mt-2 mb-4 space-y-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>

            {/* Info grid */}
            <div className="grid gap-3 sm:grid-cols-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>

            {/* Actions */}
            <Skeleton className="mt-2 h-10 w-full" />
          </Skeleton>

          {/* Attempts Table Card*/}
          <Skeleton className="flex w-full flex-col gap-2 rounded-lg bg-card p-5">
            <Skeleton className="mb-5 h-4 w-80" />

            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-2">
                <Skeleton className="h-6 w-80" />
                <Skeleton className="h-6 w-80" />
                <Skeleton className="h-6 w-80" />
                <Skeleton className="h-6 w-80" />
              </div>
            ))}
          </Skeleton>
        </div>
      </main>
    </div>
  )
}
