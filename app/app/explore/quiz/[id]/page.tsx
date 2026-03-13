import BackButton from "@/components/back-button"
import { ROUTES } from "@/constants"
import QuizDetail from "@/explore/quiz/_components/detail"
import QuizAttemptList from "@/explore/quiz/_components/detail/attempts"
import { quizAttempt, quizWithQuestions } from "@/explore/quiz/types"
import { auth } from "@/lib/auth"
import { prisma } from "@/prisma/client"
import { QuestionnaireType } from "@/prisma/enums"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect(ROUTES.UNAUTHENTICATED_ERROR)
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true },
  })

  if (!user) {
    redirect(ROUTES.UNAUTHENTICATED_ERROR)
  }

  const { id } = await params

  const quiz = await prisma.questionnaire.findUnique({
    where: { id: id, type: QuestionnaireType.QUIZ },
    ...quizWithQuestions,
  })

  if (!quiz) return

  const userResponses = await prisma.questionnaireResponse.groupBy({
    by: ["questionnaireId"],
    where: {
      userId: user.id,
      questionnaireId: quiz.id,
    },
    _max: { total: true },
    _count: { id: true },
  })

  const scoreRecord = userResponses[0]
  const scoreData = scoreRecord
    ? { bestScore: scoreRecord._max.total, attemptCount: scoreRecord._count.id }
    : { bestScore: null, attemptCount: 0 }

  const attempts = await prisma.questionnaireResponse.findMany({
    where: { userId: user.id, questionnaireId: quiz.id },
    ...quizAttempt,
    orderBy: { submittedAt: "desc" },
  })

  const maxScore = quiz.questions.reduce((sum, q) => sum + (q.score ?? 0), 0)

  return (
    <div>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <BackButton />

        <QuizDetail quiz={quiz} scoreData={scoreData} />

        <QuizAttemptList attempts={attempts} maxScore={maxScore} />
      </main>
    </div>
  )
}
