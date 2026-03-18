"use client"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { ROUTES } from "@/lib/constants"
import { HomeIcon, RotateCw } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // TODO: Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      <Empty>
        <EmptyHeader>
          <EmptyTitle className="mask-b-from-20% mask-b-to-80% text-9xl font-extrabold text-primary">
            500
          </EmptyTitle>
          <EmptyDescription className="-mt-8 text-nowrap text-foreground/80">
            Something went wrong!
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={ROUTES.DASHBOARD} replace>
                <HomeIcon className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>

            <Button
              variant="default"
              onClick={
                // Attempt to recover by trying to re-render the segment
                () => reset()
              }
            >
              <RotateCw className="mr-2 h-4 w-4" />
              Try again
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  )
}
