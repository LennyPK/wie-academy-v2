import QuizAttemptForm from "@/explore/quiz/_components/attempt-form"
import { quizWithQuestions } from "@/explore/quiz/types"
import { requireSession } from "@/lib/auth/session"
import { prisma } from "@/prisma/client"
import { QuestionnaireType } from "@/prisma/enums"
import { notFound } from "next/navigation"

export default async function QuizAttemptPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession()
  const user = session.user
  const { id } = await params

  const quiz = await prisma.questionnaire.findUnique({
    where: { id: id, type: QuestionnaireType.QUIZ },
    ...quizWithQuestions,
  })

  if (!quiz) notFound()

  return (
    <div>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <QuizAttemptForm userId={user.id} quiz={quiz} />
      </main>
    </div>
  )
}
