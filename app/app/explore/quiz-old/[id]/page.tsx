import BackButton from "@/components/back-button"
import { auth } from "@/lib/auth"
import { ROUTES } from "@/lib/constants"
import { prisma } from "@/lib/prisma/client"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import QuizDetail from "../_components/quiz-detail"
import { getQuizWithResponses } from "../actions"

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

  // Fetch quiz with user's previous responses
  const quizData = await getQuizWithResponses(id)

  if (!quizData.quiz) {
    return (
      <div>
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <BackButton />
          <div className="mt-8 text-center">
            <h1 className="text-2xl font-bold">Quiz not found</h1>
            <p className="mt-2 text-muted-foreground">
              The quiz you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <BackButton />
        <QuizDetail
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          quiz={quizData.quiz as any}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          responses={quizData.responses as any}
          userId={user.id}
        />
      </main>
    </div>
  )
}
