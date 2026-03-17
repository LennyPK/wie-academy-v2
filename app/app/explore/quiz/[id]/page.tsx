import BackButton from "@/components/back-button"
import QuizDetail from "@/explore/quiz/_components/detail"
import QuizAttemptList from "@/explore/quiz/_components/detail/attempts"
import { quizAttempt, quizWithQuestions } from "@/explore/quiz/types"
import { requireSession } from "@/lib/auth/session"
import { prisma } from "@/prisma/client"
import { QuestionnaireType } from "@/prisma/enums"

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession()
  const user = session.user

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
