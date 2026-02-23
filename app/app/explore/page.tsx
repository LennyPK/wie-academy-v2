import { auth } from "@/lib/auth"
import { ROUTES } from "@/lib/constants"
import { FormType } from "@/lib/generated/prisma/enums"
import { prisma } from "@/lib/prisma/client"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import ExploreHeader from "./_components/header"
import QuizEmpty from "./quiz-old/_components/quiz-empty"
import QuizList from "./quiz-old/_components/quiz-list"

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
  const quizzes = await prisma.form.findMany({
    where: { type: FormType.QUIZ },
    include: {
      _count: {
        select: { questions: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  })

  // Fetch user's quiz responses to calculate best scores
  const userResponses = await prisma.formResponse.findMany({
    where: {
      userId: user.id,
      formId: { in: quizzes.map((q) => q.id) },
    },
    select: {
      formId: true,
      total: true,
    },
  })

  // Calculate best scores and attempt counts per quiz
  const userScores: Record<
    string,
    {
      bestScore: number
      maxScore: number
      attemptCount: number
    }
  > = {}

  for (const quiz of quizzes) {
    const responses = userResponses.filter((r) => r.formId === quiz.id)
    if (responses.length > 0) {
      const maxScore = await prisma.formQuestion
        .aggregate({
          where: { formId: quiz.id },
          _sum: { score: true },
        })
        .then((result) => result._sum.score || 0)

      userScores[quiz.id] = {
        bestScore: Math.max(...responses.map((r) => r.total)),
        maxScore: maxScore,
        attemptCount: responses.length,
      }
    }
  }

  return (
    <div>
      <ExploreHeader />

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        {/* No quizzes found */}
        {quizzes.length === 0 && <QuizEmpty />}

        {/* Quiz List */}
        {quizzes.length > 0 && <QuizList quizzes={quizzes} userScores={userScores} />}
      </main>
    </div>
  )
}
