import { ROUTES } from "@/lib/constants"
import { redirect } from "next/navigation"
import ResetPasswordForm from "./_components/form"

interface SearchParams {
  token: string
}

interface ResetPasswordPageProps {
  searchParams?: Promise<SearchParams>
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams

  const token = params?.token || ""

  if (!token) {
    // Handle the error
    redirect(ROUTES.UNAUTHENTICATED_ERROR)
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col">
        <ResetPasswordForm token={token} />
      </div>
    </main>
  )
}
