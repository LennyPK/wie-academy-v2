import { Prisma } from "@/generated/client"
import { requireSession } from "@/lib/auth/session"
import { prisma } from "@/prisma/client"
import { QuestionnaireType } from "@/prisma/enums"
import type { Metadata } from "next"
import QuizEmpty from "./_components/empty"
import ExploreFilters from "./_components/filters"
import ExploreHeader from "./_components/header"
import QuizList from "./_components/list"
import { quizWithQuestions } from "./quiz/types"

export const metadata: Metadata = {
  title: "Explore",
  description: "Discover new content and experiences tailored for you.",
}

interface SearchParams {
  query?: string

  page?: string
}

interface ExplorePageProps {
  searchParams?: Promise<SearchParams>
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const session = await requireSession()
  const user = session.user

  // Extract search params with defaults
  const params = await searchParams

  const query = params?.query?.trim() || ""

  // const currentPage = Number(params?.page) || 1
  // const pageSize = 6

  const conditions: Prisma.QuestionnaireWhereInput[] = []

  // Search Filter
  if (query) {
    conditions.push({
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    })
  }

  const where: Prisma.QuestionnaireWhereInput = conditions.length > 0 ? { AND: conditions } : {}

  // Fetch all quizzes with question counts
  const [quizzes, count] = await Promise.all([
    prisma.questionnaire.findMany({
      where: { type: QuestionnaireType.QUIZ, ...where },
      ...quizWithQuestions,
    }),

    prisma.questionnaire.count({ where: { type: QuestionnaireType.QUIZ, ...where } }),
  ])

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
        <ExploreFilters totalCount={count} searchQuery={query} />

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
