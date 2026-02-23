"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ROUTES } from "@/lib/constants"
import { FormQuestionType } from "@/lib/prisma/enums"
import { cn } from "@/lib/utils"
import { useForm } from "@tanstack/react-form"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { createQuiz } from "../actions"
import type { NewQuiz } from "../types"
import { formSchema } from "./form-schema"
import QuestionCard from "./form/question-card"
import type { QuizFormData } from "./form/types"

export default function QuizForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const initialValues: QuizFormData = {
    title: "",
    description: "",
    questions: [],
  }

  const form = useForm({
    defaultValues: initialValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      toast.dismiss()
      toast.loading("Creating quiz...")

      try {
        // Transform form values to NewQuiz payload
        const payload: NewQuiz = {
          title: value.title,
          description: value.description,
          questions: value.questions.map((q, qIndex) => {
            const base = {
              questionText: q.questionText,
              isRequired: q.isRequired ?? true,
              explanation: q.explanation || null,
              score: q.score || null,
              orderIndex: qIndex,
            }

            switch (q.type) {
              case "MULTICHOICE":
              case "CHECKBOX":
                return {
                  ...base,
                  type: q.type,
                  correctOptionIndexes: q.options
                    .map((opt, idx) => (opt.isCorrect ? idx : -1))
                    .filter((idx) => idx !== -1),
                  options: q.options.map((opt, idx) => ({
                    label: opt.label,
                    value: opt.value || opt.label.toLowerCase().trim(),
                    orderIndex: idx,
                  })),
                }

              case "YES_NO":
                return {
                  ...base,
                  type: q.type,
                  correctAnswer: q.correctAnswer ?? false,
                }

              case "TEXT":
                return {
                  ...base,
                  type: q.type,
                  acceptableAnswers: q.acceptableAnswers || [],
                  caseSensitive: q.caseSensitive ?? false,
                }

              case "RATING":
                return {
                  ...base,
                  type: q.type,
                  correctRating: q.correctRating,
                }

              case "SCALE":
                return {
                  ...base,
                  type: q.type,
                  correctValue: q.correctValue,
                }

              default:
                throw new Error("Unknown question type")
            }
          }),
        }

        // Call server action
        await createQuiz(payload)

        toast.dismiss()
        toast.success("Quiz created successfully!")
        router.push(ROUTES.EXPLORE)
      } catch (error) {
        toast.dismiss()
        toast.error("Failed to create quiz. Please try again.")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    },
  })

  return (
    <form
      className="space-y-6 py-4"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <Card className="shadow-none">
        <CardContent className="space-y-6 py-4">
          <form.Field name="title">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    placeholder="Enter quiz title"
                    variant="heading"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>

          <form.Field name="description">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    placeholder="Add a description for this quiz"
                    variant="default"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
        </CardContent>
      </Card>

      <h1 className="mx-2 text-3xl font-bold text-foreground">Questions</h1>

      {/* Questions Array */}
      <form.Field name="questions" mode="array">
        {(field) => (
          <div className="flex flex-col gap-2">
            {field.state.value.map((question, i) => (
              <QuestionCard
                key={i}
                form={form}
                questionIndex={i}
                question={question}
                onRemove={() => field.removeValue(i)}
                canRemove={field.state.value.length > 1}
              />
            ))}

            {/* Add Question Button */}
            <Button
              onClick={() =>
                field.pushValue({
                  questionText: "",
                  type: FormQuestionType.MULTICHOICE,
                  isRequired: true,
                  explanation: "",
                  score: 1,
                  orderIndex: field.state.value.length,
                  options: [
                    { label: "", value: "", orderIndex: 0, isCorrect: false },
                    { label: "", value: "", orderIndex: 1, isCorrect: false },
                  ],
                })
              }
              type="button"
              variant="outline"
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl py-6 text-muted-foreground transition-all",
                "border-2 border-dashed border-muted-foreground",
                "hover:border-primary hover:bg-secondary hover:text-primary"
              )}
            >
              <Plus className="h-5 w-5" />
              Add Question
            </Button>
          </div>
        )}
      </form.Field>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(ROUTES.EXPLORE)}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Quiz"}
        </Button>
      </div>
    </form>
  )
}
