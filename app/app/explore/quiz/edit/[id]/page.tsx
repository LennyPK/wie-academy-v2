import BackButton from "@/components/back-button"
import { ROUTES } from "@/constants"
import QuizForm from "@/explore/quiz/_components/form"
import { quizWithQuestions } from "@/explore/quiz/types"
import { auth } from "@/lib/auth"
import { prisma } from "@/prisma/client"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function QuizEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect(ROUTES.UNAUTHENTICATED_ERROR)
  }

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
