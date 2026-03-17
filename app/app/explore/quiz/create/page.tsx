import BackButton from "@/components/back-button"
import QuizForm from "@/explore/quiz/_components/form"
import { requireSession } from "@/lib/auth/session"

export default async function QuizCreatePage() {
  await requireSession()

  return (
    <div>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <BackButton />
        <QuizForm />
      </main>
    </div>
  )
}
