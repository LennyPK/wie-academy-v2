import { auth } from "@/lib/auth"
import { ROUTES } from "@/lib/constants"
import { prisma } from "@/lib/prisma/client"
import { FormType } from "@/lib/prisma/enums"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import QuizAttemptForm from "./_components/form"

export default async function QuizAttemptPage({ params }: { params: Promise<{ id: string }> }) {
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

  return (
    <div>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <QuizAttemptForm userId={user.id} quiz={quiz} />
      </main>
    </div>
  )
}
