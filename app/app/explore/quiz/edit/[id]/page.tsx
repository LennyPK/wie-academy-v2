import BackButton from "@/components/back-button"
import QuizForm from "@/explore/quiz/_components/form"
import { quizWithQuestions } from "@/explore/quiz/types"
import { requireSession } from "@/lib/auth/session"
import { prisma } from "@/prisma/client"

export default async function QuizEditPage({ params }: { params: Promise<{ id: string }> }) {
  await requireSession()
  const { id } = await params

  const quiz = await prisma.questionnaire.findUnique({
    where: { id: id },
    ...quizWithQuestions,
  })

  return (
    <div>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <BackButton />
        <QuizForm quiz={quiz ?? undefined} />
      </main>
    </div>
  )
}
