import BackButton from "@/components/back-button"
import { auth } from "@/lib/auth"
import { ROUTES } from "@/lib/constants"
import { prisma } from "@/lib/prisma/client"
import { FormType } from "@/lib/prisma/enums"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import QuizDetail from "./_components/detail"

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

  const quiz = await prisma.form.findUnique({
    where: { id: id, type: FormType.QUIZ },
    include: {
      questions: { include: { options: true } },
    },
  })

  if (!quiz) return

  const userResponses = await prisma.formResponse.groupBy({
    by: ["formId"],
    where: {
      userId: user.id,
      formId: quiz.id,
    },
    _max: { total: true },
    _count: { id: true },
  })

  const scoreRecord = userResponses[0]
  const scoreData = scoreRecord
    ? { bestScore: scoreRecord._max.total, attemptCount: scoreRecord._count.id }
    : { bestScore: null, attemptCount: 0 }

  return (
    <div>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <BackButton />

        <QuizDetail quiz={quiz} scoreData={scoreData} />
      </main>
    </div>
  )
}
