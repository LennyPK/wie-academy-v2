import { ROUTES } from "@/constants"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma/client"
import { QuestionnaireType } from "@/prisma/enums"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import ExploreHeader from "./_components/header"
import QuizEmpty from "./quiz/_components/empty"
import QuizList from "./quiz/_components/list"
import { quizWithQuestions } from "./quiz/types"

export const metadata: Metadata = {
  title: "Explore",
  description: "Discover new content and experiences tailored for you.",
}

export default async function ExplorePage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect(ROUTES.UNAUTHENTICATED_ERROR)
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      role: true,
    },
  })

  if (!user) {
    redirect(ROUTES.UNAUTHENTICATED_ERROR)
  }

  // Fetch all quizzes with question counts
  const quizzes = await prisma.questionnaire.findMany({
    where: { type: QuestionnaireType.QUIZ },
    ...quizWithQuestions,
  })

  const userResponses = await prisma.questionnaireResponse.groupBy({
    by: ["questionnaireId"],
    where: {
      userId: user.id,
      questionnaireId: { in: quizzes.map((quiz) => quiz.id) },
    },
    _max: { total: true },
    _count: { id: true },
  })

  const quizScores = Object.fromEntries(
    userResponses.map((record) => [
      record.questionnaireId,
      { bestScore: record._max.total, attemptCount: record._count.id },
    ])
  )

  return (
    <div>
      <ExploreHeader userRole={user.role} />

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        {/* No quizzes found */}
        {quizzes.length === 0 && <QuizEmpty />}

        {/* Quiz List */}
        {quizzes.length > 0 && (
          <QuizList userRole={user.role} quizzes={quizzes} quizScores={quizScores} />
        )}
      </main>
    </div>
  )
}
