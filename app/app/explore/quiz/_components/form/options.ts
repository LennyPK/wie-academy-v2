import { QuizWithQuestions } from "@/explore/quiz/types"
import { QuestionnaireQuestionType } from "@/prisma/enums"
import { formOptions } from "@tanstack/react-form"
import * as z from "zod"
import { formSchema } from "./form-schema"

export const initialValues: z.infer<typeof formSchema> = {
  title: "",
  description: "",
  questions: [
    {
      tempId: crypto.randomUUID(),
      prompt: "",
      type: QuestionnaireQuestionType.SINGLE_SELECT,
      isRequired: true,
      order: 0,
      score: 1,
      options: [
        { tempId: crypto.randomUUID(), label: "", value: "", isCorrect: false, order: 0, score: 0 },
        { tempId: crypto.randomUUID(), label: "", value: "", isCorrect: false, order: 1, score: 0 },
      ],
    },
    {
      tempId: crypto.randomUUID(),
      prompt: "",
      type: QuestionnaireQuestionType.SINGLE_SELECT,
      isRequired: true,
      order: 1,
      score: 1,
      options: [
        { tempId: crypto.randomUUID(), label: "", value: "", isCorrect: false, order: 0, score: 0 },
        { tempId: crypto.randomUUID(), label: "", value: "", isCorrect: false, order: 1, score: 0 },
      ],
    },
  ],
}

export const formOpts = (quiz?: QuizWithQuestions) =>
  formOptions({
    defaultValues: quiz ? mapQuizToForm(quiz) : initialValues,
  })

function mapQuizToForm(quiz: QuizWithQuestions): z.infer<typeof formSchema> {
  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description ?? "",
    questions: quiz.questions.map((question) => {
      const base = {
        id: question.id,
        tempId: question.id,
        prompt: question.prompt,
        score: question.score ?? 1,
        isRequired: question.isRequired,
        order: question.order,
      }

      switch (question.type) {
        case QuestionnaireQuestionType.SINGLE_SELECT:
        case QuestionnaireQuestionType.MULTI_SELECT:
          return {
            ...base,
            type: question.type,
            options: question.options.map((option) => ({
              id: option.id,
              tempId: option.id,
              label: option.label,
              value: option.value,
              isCorrect: option.isCorrect,
              score: option.score,
              order: option.order,
            })),
          }
        case QuestionnaireQuestionType.TRUE_FALSE:
          return {
            ...base,
            type: question.type,
            correctAnswer: question.trueFalseAnswer ?? false, // fallback to satisfy typescript
            trueLabel: question.trueLabel ?? undefined,
            falseLabel: question.falseLabel ?? undefined,
          }
        case QuestionnaireQuestionType.RATING:
          return {
            ...base,
            type: question.type,
            targetValue: question.ratingTarget ?? 1, // fallback to satisfy typescript
          }
        case QuestionnaireQuestionType.SCALE:
          return {
            ...base,
            type: question.type,
            minValue: question.scaleMin ?? 0, // fallback to satisfy typescript
            maxValue: question.scaleMax ?? 10, // fallback to satisfy typescript
            targetValue: question.scaleTarget ?? 5, // fallback to satisfy typescript
            minLabel: question.scaleMinLabel ?? undefined,
            maxLabel: question.scaleMaxLabel ?? undefined,
          }
        default:
          return { ...base, type: question.type }
      }
    }),
  }
}
