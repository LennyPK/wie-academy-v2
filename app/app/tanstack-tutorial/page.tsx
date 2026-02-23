import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Suspense } from "react"
import RegisterForm from "./_components/register-form-refactored"

export default function Page() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col">
        <Suspense
          fallback={
            <Button disabled size="sm">
              <Spinner data-icon="inline-start" />
              Loading...
            </Button>
          }
        >
          <RegisterForm />
        </Suspense>
      </div>
    </main>
  )
}
