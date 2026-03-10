import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { quizResult } from "@/explore/quiz/types"
import { auth } from "@/lib/auth"
import { ROUTES } from "@/lib/constants"
import { prisma } from "@/lib/prisma/client"
import { FormQuestionType } from "@/lib/prisma/enums"
import { cn } from "@/lib/utils"
import { BarChart3, Check, Trophy, X } from "lucide-react"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function QuizResultsPage({
  params,
}: {
  params: Promise<{ attemptId: string }>
}) {
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

  const { attemptId } = await params

  const response = await prisma.formResponse.findUnique({
    where: { id: attemptId },
    ...quizResult,
  })

  if (!response) return

  const quiz = response.form
  const questions = response.form.questions
  const correctCount = response.answers.filter((answer) => answer.isCorrect === true).length
  const maxScore = questions.reduce((sum, question) => sum + (question.score ?? 0), 0)
  const percentage = ((response.total ?? 0) / maxScore) * 100
  const passed = response.total === maxScore

  return (
    <div>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Card className="overflow-hidden pt-0">
          <CardHeader
            className={cn(
              "justify-items-center gap-5 py-10",
              passed ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"
            )}
          >
            <span className="text-center text-2xl font-bold">{quiz.title}</span>

            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted text-warning">
              {passed ? <Trophy className="h-8 w-8" /> : <BarChart3 className="h-8 w-8" />}
            </div>

            <span className="text-xl font-bold">{passed ? "Great job!" : "Keep practicing!"}</span>
          </CardHeader>

          <CardContent>
            {/* Score stats */}
            <div className="my-10 flex flex-col items-center justify-center gap-6 sm:my-15 sm:flex-row sm:gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary sm:text-4xl">
                  {percentage.toFixed(0)}%
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Score</p>
              </div>

              <div className="hidden h-12 w-px bg-muted-foreground sm:block" />

              <div className="text-center">
                <p className="text-3xl font-bold sm:text-4xl">
                  {correctCount}/{questions.length}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Correct</p>
              </div>

              <div className="hidden h-12 w-px bg-muted-foreground" />

              <div className="text-center">
                <p className="text-3xl font-bold sm:text-4xl">
                  {response.total}/{maxScore}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Points</p>
              </div>
            </div>

            {/* Question List */}
            <div className="divide-y divide-muted rounded-md border border-muted">
              {questions.map((question, i) => {
                const answer = response.answers.find((answer) => answer.questionId === question.id)
                const isCorrect = answer?.isCorrect ?? false

                return (
                  <div key={question.id} className="p-5">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                          isCorrect
                            ? "bg-success text-success-foreground"
                            : "bg-destructive text-destructive-foreground"
                        )}
                      >
                        {isCorrect ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <p className="text-sm font-medium">
                          Q{i + 1}. {question.prompt}
                        </p>

                        {question.type === FormQuestionType.TRUE_FALSE && (
                          <div className="flex flex-col gap-2">
                            {[
                              { label: question.trueLabel ?? "True", value: true },
                              { label: question.falseLabel ?? "False", value: false },
                            ].map(({ label, value }) => {
                              const isUserChoice = answer?.valueBoolean === value
                              const isCorrectAnswer = question.correctAnswer === value

                              return (
                                <div
                                  key={String(value)}
                                  className={cn(
                                    "flex items-center gap-2 rounded-md border px-4 py-2 text-sm",
                                    isCorrectAnswer &&
                                      isUserChoice &&
                                      "border-success bg-success text-success-foreground",
                                    isCorrectAnswer &&
                                      !isUserChoice &&
                                      "border-success bg-success/20",
                                    isUserChoice &&
                                      !isCorrectAnswer &&
                                      "border-destructive bg-destructive text-destructive-foreground"
                                  )}
                                >
                                  {isUserChoice &&
                                    (isCorrect ? (
                                      <Check className="h-3 w-3" />
                                    ) : (
                                      <X className="h-3 w-3" />
                                    ))}
                                  {label}
                                </div>
                              )
                            })}
                          </div>
                        )}

                        {(question.type === FormQuestionType.SINGLE_SELECT ||
                          question.type === FormQuestionType.MULTI_SELECT) && (
                          <div className="flex flex-col gap-2">
                            {question.options
                              .sort((a, b) => a.order - b.order)
                              .map((option) => {
                                const selectedOptionIds =
                                  answer?.valueOptions.map((v) => v.option.id) ?? []
                                const isUserChoice = selectedOptionIds.includes(option.id)
                                const isCorrectOption = option.isCorrect

                                return (
                                  <div
                                    key={option.id}
                                    className={cn(
                                      "flex items-center gap-2 rounded-md border px-4 py-2 text-sm",
                                      isCorrectOption &&
                                        isUserChoice &&
                                        "border-success bg-success text-success-foreground",
                                      isCorrectOption &&
                                        !isUserChoice &&
                                        "border-success bg-success/20",
                                      !isCorrectOption &&
                                        isUserChoice &&
                                        "border-destructive bg-destructive text-destructive-foreground"
                                    )}
                                  >
                                    {isUserChoice &&
                                      (isCorrectOption ? (
                                        <Check className="h-3 w-3" />
                                      ) : (
                                        <X className="h-3 w-3" />
                                      ))}
                                    {option.label}
                                  </div>
                                )
                              })}
                          </div>
                        )}

                        <div className="mt-1 flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">
                            {answer?.score}/{question.score || 0} pts
                          </span>
                        </div>

                        {/* Show explanation */}
                        {!isCorrect && (
                          <div className="rounded-md bg-muted p-3">
                            <p className="text-xs font-medium text-muted-foreground">Explanation</p>{" "}
                            <p className="text-sm text-foreground">
                              {question.explanation
                                ? question.explanation
                                : "No explanation provided"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-2 sm:w-full sm:flex-row">
            {passed ? (
              <Button asChild className="w-full sm:flex-1">
                <Link href={`${ROUTES.QUIZ}/${quiz.id}`}>View Quiz</Link>
              </Button>
            ) : (
              <Button asChild className="w-full sm:flex-1">
                <Link href={`${ROUTES.QUIZ}/${quiz.id}/attempt`}>Try Again</Link>
              </Button>
            )}

            <Button asChild variant="outline" className="w-full sm:flex-1">
              <Link href={ROUTES.EXPLORE}>Back to Quizzes</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
