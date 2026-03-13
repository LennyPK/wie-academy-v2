import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4">
          <Skeleton className="flex w-full flex-col gap-6 rounded-lg bg-card sm:gap-8">
            {/* Header Card */}
            <Skeleton className="flex w-full flex-col items-center justify-center gap-5 py-10">
              <Skeleton className="h-6 w-80 shrink-0 bg-card" />
              <Skeleton className="h-16 w-16 shrink-0 rounded-full bg-card" />
              <Skeleton className="h-6 w-50 shrink-0 bg-card" />
            </Skeleton>

            {/* Stats */}
            <div className="my-10 flex flex-col items-center justify-center gap-6 sm:my-15 sm:flex-row sm:gap-8">
              <div>
                <Skeleton className="h-12 w-20" />
                <Skeleton className="mt-4 h-4 w-20" />
              </div>
              <div>
                <Skeleton className="h-12 w-20" />
                <Skeleton className="mt-4 h-4 w-20" />
              </div>
              <div>
                <Skeleton className="h-12 w-20" />
                <Skeleton className="mt-4 h-4 w-20" />
              </div>
            </div>

            {/* Question List */}
            <div className="m-5 mb-0 divide-y divide-muted rounded-md border border-muted">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-2 p-5">
                  {/* Check */}
                  <Skeleton className="h-6 w-6 shrink-0 rounded-full" />

                  {/* Question & Answers */}
                  <div className="w-full overflow-hidden">
                    <Skeleton className="mb-4 h-6 w-100" />
                    <div className="flex w-full flex-col gap-2">
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                    <Skeleton className="mt-4 h-4 w-20" />
                  </div>
                </div>
              ))}
            </div>

            <div className="m-5 mt-0 flex flex-col gap-2 sm:flex-row sm:justify-between sm:align-middle">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </Skeleton>
        </div>
      </main>
    </div>
  )
}
