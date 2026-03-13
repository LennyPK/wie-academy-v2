"use client"

import { useAppForm } from "@/components/form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { ROUTES } from "@/constants"
import { insertQuizResponse } from "@/explore/quiz/actions"
import { QuizWithQuestions } from "@/explore/quiz/types"
import { QuestionnaireQuestionType, QuestionnaireType } from "@/prisma/enums"
import { cn } from "@/utils"
import { useStore } from "@tanstack/react-form"
import { ArrowRight, Check, ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import z from "zod"
import { MultiSelectAnswer } from "./answer-forms/multi-select"
import { SingleSelectAnswer } from "./answer-forms/single-select"
import { TrueFalseAnswer } from "./answer-forms/true-false"
import { attemptSchema } from "./form-schema"
import { formatAnswer, formatAnswerType } from "./options"

interface QuizAttemptFormProps {
  quiz: QuizWithQuestions
  userId: string
}

export default function QuizAttemptForm({ quiz }: QuizAttemptFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const quizQuestionTypes: QuestionnaireQuestionType[] = [
    QuestionnaireQuestionType.SINGLE_SELECT,
    QuestionnaireQuestionType.MULTI_SELECT,
    QuestionnaireQuestionType.TRUE_FALSE,
  ]
  const questions = quiz.questions
    .filter((q) =>
      quiz.type === QuestionnaireType.QUIZ ? quizQuestionTypes.includes(q.type) : true
    )
    .sort((a, b) => a.order - b.order)
  const currentQuestion = questions[currentStep]
  const isSummaryStep = currentStep === questions.length

  const handleNext = async () => {
    // Validate only the current question's answer before advancing
    if (currentQuestion.isRequired) {
      const result =
        currentQuestion.type === QuestionnaireQuestionType.MULTI_SELECT
          ? await form.validateField(`answers[${currentStep}].values`, "change")
          : await form.validateField(`answers[${currentStep}].value`, "change")

      if (result.length > 0) return
    }

    setCurrentStep((prev) => prev + 1)
  }

  const handlePrev = async () => {
    setCurrentStep((current) => current - 1)
  }

  const handleJumpTo = (index: number) => {
    setCurrentStep(index)
  }

  function isAnswered(answer: z.input<typeof attemptSchema>["answers"][number]): boolean {
    switch (answer.type) {
      case QuestionnaireQuestionType.SINGLE_SELECT:
        return answer.value !== ""
      case QuestionnaireQuestionType.MULTI_SELECT:
        return answer.values.length > 0
      case QuestionnaireQuestionType.TRUE_FALSE:
        return answer.value !== null
    }
  }

  const initialValues: z.input<typeof attemptSchema>["answers"] = questions.map((q) => {
    switch (q.type) {
      // case QuestionnaireQuestionType.TEXT:
      //   return { questionId: q.id, type: q.type, value: "" }
      case QuestionnaireQuestionType.SINGLE_SELECT:
        return { questionId: q.id, type: q.type, value: "" }
      case QuestionnaireQuestionType.MULTI_SELECT:
        return { questionId: q.id, type: q.type, values: [] }
      case QuestionnaireQuestionType.TRUE_FALSE:
        return { questionId: q.id, type: q.type, value: null }
      // case QuestionnaireQuestionType.RATING:
      //   return { questionId: q.id, type: q.type, value: 0 }
      // case QuestionnaireQuestionType.SCALE:
      //   return { questionId: q.id, type: q.type, value: null }
      default:
        throw new Error(`Unexpected question type: ${q.type}`)
    }
  })

  const form = useAppForm({
    defaultValues: {
      answers: initialValues,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)
      toast.loading("Saving...")

      const sanitizedAnswers = attemptSchema.parse(value)

      try {
        const response = await insertQuizResponse(quiz.id, sanitizedAnswers.answers)
        toast.dismiss()
        toast.success("Quiz submitted!")
        router.replace(`${ROUTES.QUIZ}/${quiz.id}/results/${response.id}`)
      } catch {
        toast.dismiss()
        toast.error("Something went wrong. Please try again.")
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  const answers = useStore(form.store, (state) => state.values.answers)
  const progress = (answers.filter((answer) => isAnswered(answer)).length / questions.length) * 100

  const headerCard = (
    <Card>
      <CardHeader className="flex flex-col justify-center gap-4 sm:grid sm:grid-cols-[120px_1fr_120px] sm:items-center sm:gap-2">
        <Button
          type="button"
          variant="link"
          className="justify-start px-0 text-sm text-muted-foreground has-[>svg]:px-0"
          onClick={() => router.back()}
        >
          <ChevronLeft className="size-5" />
          <span>Exit</span>
        </Button>

        <div className="flex flex-1 flex-col gap-2 sm:items-center">
          <CardTitle className="sm:text-center">{quiz.title}</CardTitle>
          <CardDescription className="sm:text-center">
            {isSummaryStep
              ? "Review your answers"
              : `Question ${currentStep + 1} of ${questions.length}`}
          </CardDescription>
          {!isSummaryStep && currentQuestion.score && (
            <Badge variant="outline">{currentQuestion.score} pts</Badge>
          )}
        </div>

        <div className="hidden w-full justify-center sm:flex sm:justify-end">
          <Badge variant="secondary" className="justify-end">
            {Math.round(progress)}%
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col space-y-4">
        <Progress value={progress} />
      </CardContent>
    </Card>
  )

  const summaryCard = (
    <form.Subscribe selector={(state) => state.values.answers}>
      {(answers) => (
        <Card>
          <CardHeader>
            <CardDescription>Check your answers before submitting.</CardDescription>
          </CardHeader>

          <CardContent className="divide-y">
            {questions.map((question, i) => {
              const answer = answers[i]
              return (
                <button
                  key={question.id}
                  className="flex w-full items-center gap-2 px-2 py-3 text-left transition-colors hover:bg-muted sm:gap-4 sm:px-4 sm:py-5"
                  type="button"
                  onClick={() => handleJumpTo(i)}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                      answer !== null
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted-foreground text-muted"
                    )}
                  >
                    {answer !== null ? <Check className="h-3 w-3" /> : i + 1}
                  </span>

                  <div className="flex flex-1 flex-col gap-1">
                    <p className="text-sm font-medium">{question.prompt}</p>

                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                      <p className="text-sm text-muted-foreground">{formatAnswerType(answer)}</p>
                      <p className="hidden text-sm text-muted-foreground sm:inline">|</p>
                      <p className="text-sm font-medium text-primary">
                        {formatAnswer(answer, question)}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="mx-4 hidden h-3 w-3 sm:block" />
                </button>
              )
            })}
          </CardContent>
        </Card>
      )}
    </form.Subscribe>
  )

  const navCard = (
    <Card>
      <CardContent className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between sm:align-middle">
        <Button type="button" variant="outline" onClick={handlePrev} disabled={currentStep === 0}>
          Back
        </Button>

        <form.Subscribe selector={(state) => state.values.answers}>
          {(answers) => {
            const allAnswered = answers.every((answer) => isAnswered(answer))

            return (
              <div className="hidden items-center justify-center gap-2 sm:flex">
                {questions.map((question, i) => {
                  const answered = isAnswered(answers[i])
                  const isCurrent = i === currentStep
                  const isNavigable = answered || isCurrent || i < currentStep || isSummaryStep

                  return (
                    <button
                      key={question.id}
                      type="button"
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => handleJumpTo(i)}
                      className={cn(
                        "group flex h-2 items-center justify-center rounded-full px-0 transition-all duration-200 hover:h-5 hover:w-8",
                        isCurrent
                          ? "w-8 bg-primary text-primary-foreground hover:w-16"
                          : answered
                            ? "w-2 bg-primary/50 text-primary-foreground"
                            : "w-2 cursor-not-allowed bg-muted hover:h-2 hover:w-2"
                      )}
                      aria-label={`Go to question ${i + 1}`}
                      disabled={!isNavigable}
                    >
                      {hoveredIndex === i && <span className="text-xs">Q{i + 1}</span>}
                    </button>
                  )
                })}

                <button
                  type="button"
                  onMouseEnter={() => setHoveredIndex(questions.length)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => handleJumpTo(questions.length)}
                  className={cn(
                    "group flex h-2 items-center justify-center rounded-full px-0 transition-all duration-200 hover:h-5 hover:w-8",
                    isSummaryStep
                      ? "w-8 bg-success text-success-foreground hover:w-16"
                      : allAnswered
                        ? "w-2 bg-success/50 text-success-foreground"
                        : "w-2 cursor-not-allowed bg-muted hover:h-2 hover:w-2"
                  )}
                  aria-label={"Go to summary"}
                  disabled={!allAnswered}
                >
                  {hoveredIndex === questions.length && <Check className="h-3 w-3" />}
                </button>
              </div>
            )
          }}
        </form.Subscribe>

        {isSummaryStep ? (
          <Button key="submit" type="submit" disabled={isSubmitting}>
            {isSubmitting && <Spinner data-icon="inline-start" />}
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        ) : (
          <Button key="next" type="button" onClick={handleNext}>
            Next
          </Button>
        )}
      </CardContent>
    </Card>
  )

  return (
    <form
      className="space-y-6 py-4"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      {headerCard}

      {isSummaryStep ? (
        summaryCard
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{currentQuestion.prompt}</CardTitle>
            <CardDescription>
              {!currentQuestion.isRequired && <span>Optional</span>}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {(() => {
              switch (currentQuestion.type) {
                // case QuestionnaireQuestionType.TEXT:
                //   return <TextAnswer form={form} questionIndex={currentStep} />
                case QuestionnaireQuestionType.SINGLE_SELECT:
                  return (
                    <SingleSelectAnswer
                      form={form}
                      questionIndex={currentStep}
                      options={currentQuestion.options}
                    />
                  )
                case QuestionnaireQuestionType.MULTI_SELECT:
                  return (
                    <MultiSelectAnswer
                      form={form}
                      questionIndex={currentStep}
                      options={currentQuestion.options}
                    />
                  )
                case QuestionnaireQuestionType.TRUE_FALSE:
                  return (
                    <TrueFalseAnswer
                      form={form}
                      questionIndex={currentStep}
                      trueLabel={currentQuestion.trueLabel ?? "True"}
                      falseLabel={currentQuestion.falseLabel ?? "False"}
                    />
                  )
                // case QuestionnaireQuestionType.RATING:
                //   return <RatingAnswer form={form} questionIndex={currentStep} />
                // case QuestionnaireQuestionType.SCALE:
                //   return (
                //     <ScaleAnswer
                //       form={form}
                //       questionIndex={currentStep}
                //       min={currentQuestion.scaleMin ?? 1}
                //       max={currentQuestion.scaleMax ?? 10}
                //       minLabel={currentQuestion.scaleMinLabel ?? "Minimum"}
                //       maxLabel={currentQuestion.scaleMaxLabel ?? "Maximum"}
                //     />
                //   )
                default:
                  return null
              }
            })()}
          </CardContent>
        </Card>
      )}

      {navCard}
    </form>
  )
}
