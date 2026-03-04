"use client"

import { useAppForm } from "@/components/form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { insertQuizResponse } from "@/explore/quiz/create/actions"
import { QuizWithQuestions } from "@/explore/quiz/types"
import { FormQuestionType, FormType } from "@/lib/prisma/enums"
import { useState } from "react"
import { toast } from "sonner"
import z from "zod"
import { formatAnswer } from "."
import { MultiSelectAnswer } from "./answer.multi-select"
import { SingleSelectAnswer } from "./answer.single-select"
import { TrueFalseAnswer } from "./answer.true-false"
import { attemptSchema } from "./form-schema"

interface QuizAttemptFormProps {
  quiz: QuizWithQuestions
  userId: string
}

export default function QuizAttemptForm({ quiz, userId }: QuizAttemptFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const quizQuestionTypes: FormQuestionType[] = [
    FormQuestionType.SINGLE_SELECT,
    FormQuestionType.MULTI_SELECT,
    FormQuestionType.TRUE_FALSE,
  ]
  const questions = quiz.questions
    .filter((q) => (quiz.type === FormType.QUIZ ? quizQuestionTypes.includes(q.type) : true))
    .sort((a, b) => a.order - b.order)
  const currentQuestion = questions[currentStep]
  const isSummaryStep = currentStep === questions.length
  const progress = (currentStep / questions.length) * 100

  const handleNext = async () => {
    // Validate only the current question's answer before advancing
    if (currentQuestion.isRequired) {
      const result =
        currentQuestion.type === FormQuestionType.MULTI_SELECT
          ? await form.validateField(`answers[${currentStep}].values`, "change")
          : await form.validateField(`answers[${currentStep}].value`, "change")

      if (result.length > 0) return
    }

    setCurrentStep((prev) => prev + 1)
  }

  const initialValues: z.input<typeof attemptSchema>["answers"] = questions.map((q) => {
    switch (q.type) {
      // case FormQuestionType.TEXT:
      //   return { questionId: q.id, type: q.type, value: "" }
      case FormQuestionType.SINGLE_SELECT:
        return { questionId: q.id, type: q.type, value: "" }
      case FormQuestionType.MULTI_SELECT:
        return { questionId: q.id, type: q.type, values: [] }
      case FormQuestionType.TRUE_FALSE:
        return { questionId: q.id, type: q.type, value: null }
      // case FormQuestionType.RATING:
      //   return { questionId: q.id, type: q.type, value: 0 }
      // case FormQuestionType.SCALE:
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
      console.log(value)

      const sanitizedAnswers = attemptSchema.parse(value)

      try {
        await insertQuizResponse(quiz.id, sanitizedAnswers.answers)
        toast.dismiss()
        toast.success("Quiz submitted!")
      } catch {
        toast.dismiss()
        toast.error("Something went wrong. Please try again.")
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  console.log(userId)

  return (
    <form
      className="space-y-6 py-4"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{quiz.title}</CardTitle>
          <CardDescription>{quiz.description}</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col space-y-4">
          <span>{!isSummaryStep && `Question ${currentStep + 1} of ${questions.length}`}</span>
          <span>{Math.round(progress)}% complete</span>
          <Progress value={progress} />
        </CardContent>
      </Card>
      <div className="flex flex-col space-y-4">
        <span>{quiz.id}</span>
      </div>

      {isSummaryStep ? (
        <form.Subscribe selector={(state) => state.values.answers}>
          {(answers) => (
            <Card>
              <CardHeader>
                <CardTitle>Review your answers</CardTitle>
                <CardDescription>Check your answers before submitting.</CardDescription>
              </CardHeader>

              <CardContent>
                {questions.map((question, i) => {
                  const answer = answers[i]
                  return (
                    <div key={question.id} className="space-y-1">
                      <p className="text-sm font-medium">
                        Q{i + 1}. {question.prompt}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatAnswer(answer, question)}
                      </p>
                    </div>
                  )
                })}
              </CardContent>

              <CardFooter className="flex justify-between">
                {/* <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(questions.length - 1)}
                >
                  Back
                </Button> */}
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Spinner data-icon="inline-start" />}
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </CardFooter>
            </Card>
          )}
        </form.Subscribe>
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
                // case FormQuestionType.TEXT:
                //   return <TextAnswer form={form} questionIndex={currentStep} />
                case FormQuestionType.SINGLE_SELECT:
                  return (
                    <SingleSelectAnswer
                      form={form}
                      questionIndex={currentStep}
                      options={currentQuestion.options}
                    />
                  )
                case FormQuestionType.MULTI_SELECT:
                  return (
                    <MultiSelectAnswer
                      form={form}
                      questionIndex={currentStep}
                      options={currentQuestion.options}
                    />
                  )
                case FormQuestionType.TRUE_FALSE:
                  return (
                    <TrueFalseAnswer
                      form={form}
                      questionIndex={currentStep}
                      trueLabel={currentQuestion.trueLabel ?? "True"}
                      falseLabel={currentQuestion.falseLabel ?? "False"}
                    />
                  )
                // case FormQuestionType.RATING:
                //   return <RatingAnswer form={form} questionIndex={currentStep} />
                // case FormQuestionType.SCALE:
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

          <CardFooter>
            {/* {isLastQuestion ? (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Spinner data-icon="inline-start" />}
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            ) : (
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            )} */}
            <Button type="button" onClick={handleNext}>
              Next
            </Button>
          </CardFooter>
        </Card>
      )}
    </form>
  )
}
