import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="py-4">
          <Skeleton className="h-9 w-30 bg-card" />
          {/* <Button variant="ghost" className="text-sm text-muted-foreground" onClick={handleClick}>
            <ChevronLeft className="size-5" />
            <span>{label ? label : "Back"}</span>
          </Button> */}
        </div>
        <div>
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
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-40" />
            </div>

            {/* Actions */}
            <Skeleton className="my-4 h-17 w-full" />

            {/* Content */}
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </Skeleton>

          {/* Interactions */}
          <div className="my-5 flex gap-5 px-2">
            <Skeleton className="h-6 w-20 bg-card" />
            <Skeleton className="h-6 w-20 bg-card" />
            <Skeleton className="h-6 w-20 bg-card" />
          </div>

          {/* Reply List */}
          <div className="flex flex-col gap-2">
            {/* Reply Box */}
            <Skeleton className="flex w-full bg-card p-5">
              <Skeleton className="h-9 w-full" />
            </Skeleton>

            {/* Reply Card */}
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="flex flex-col bg-card p-5">
                {/* Author */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-40" />
                </div>

                {/* Content */}
                <div className="my-2 flex flex-col gap-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </Skeleton>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
