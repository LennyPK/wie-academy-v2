import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Back button */}
        <div className="py-4">
          <Skeleton className="h-9 w-30 bg-card" />
        </div>

        {/* Header card */}
        <Skeleton className="flex w-full flex-col gap-2 rounded-lg bg-card p-5">
          {/* Quiz title */}
          <div className="flex flex-col gap-2">
            <Skeleton className="mt-4 h-4 w-20" />
            <Skeleton className="h-18 w-full" />
          </div>

          {/* Quiz description */}
          <div className="flex flex-col gap-2">
            <Skeleton className="mt-4 h-4 w-20" />
            <Skeleton className="h-9 w-full" />
          </div>
        </Skeleton>

        <Skeleton className="my-5 h-12 w-40 bg-card" />

        {/* Question cards */}
        <div className="flex flex-col gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="flex w-full flex-col gap-2 rounded-lg bg-card p-5">
              {/* Question header */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-50" />
              </div>

              {/* Question type */}
              <div className="flex flex-col gap-2">
                <Skeleton className="mt-4 h-4 w-20" />
                <Skeleton className="h-9 w-full" />
              </div>

              {/* Question prompt */}
              <div className="flex flex-col gap-2">
                <Skeleton className="mt-4 h-4 w-20" />
                <Skeleton className="h-9 w-full" />
              </div>

              {/* isRequired and score */}
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="mt-4 flex flex-1 flex-row gap-2">
                  <div className="flex flex-1 flex-col">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="mt-4 h-4 w-40" />
                  </div>
                  <Skeleton className="h-4 w-8 rounded-full" />
                </div>

                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="mt-4 h-4 w-20" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </div>

              {/* Options */}
              <div className="mt-4 space-y-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="flex gap-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-9 flex-1" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
                ))}
              </div>

              {/* Add option button */}
              <Skeleton className="mt-2 h-10 w-full" />
            </Skeleton>
          ))}
        </div>

        <Skeleton className="my-5 h-15 w-full bg-card" />

        <div className="my-5 flex flex-col gap-2 sm:flex-row sm:justify-between sm:align-middle">
          <Skeleton className="h-10 w-full bg-card" />
          <Skeleton className="h-10 w-full bg-card" />
        </div>
      </main>
    </div>
  )
}
