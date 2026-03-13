import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4">
          {/* Header Card */}
          <Skeleton className="flex w-full flex-col gap-2 rounded-lg bg-card p-5">
            <div className="py-4">
              <Skeleton className="h-9 w-30" />
            </div>
            <Skeleton className="h-6 w-80" />
            <Skeleton className="h-4 w-60" />
            <Skeleton className="h-4 w-10" />

            <Skeleton className="mt-2 h-4 w-full" />
          </Skeleton>

          {/* Question Card */}
          <Skeleton className="flex w-full flex-col gap-2 overflow-hidden rounded-lg bg-card p-5">
            <Skeleton className="mb-5 h-6 w-100 max-w-sm" />

            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                <Skeleton className="h-6 w-100" />
              </div>
            ))}
          </Skeleton>

          {/* Nav Card */}
          <Skeleton className="flex flex-col gap-2 rounded-lg bg-card p-5 sm:flex-row sm:justify-between sm:align-middle">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </Skeleton>
        </div>
      </main>
    </div>
  )
}
