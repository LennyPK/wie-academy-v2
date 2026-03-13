import BackButton from "@/components/back-button"
import { ROUTES } from "@/constants"
import QuizForm from "@/explore/quiz/_components/form"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function QuizCreatePage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect(ROUTES.UNAUTHENTICATED_ERROR)
  }

  return (
    <div>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <BackButton />
        <QuizForm />
      </main>
    </div>
  )
}
