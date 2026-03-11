import { QuizWithQuestions } from "@/explore/quiz/types"
import { QuestionnaireQuestionType } from "@/lib/prisma/enums"
import { formOptions } from "@tanstack/react-form"
import * as z from "zod"
import { attemptSchema } from "./form-schema"

export const initialValues: z.input<typeof attemptSchema> = { answers: [] }

export const formOpts = formOptions({
  defaultValues: initialValues,
})

export function formatAnswer(
  answer: z.input<typeof attemptSchema>["answers"][number],
  question: QuizWithQuestions["questions"][number]
): string {
  switch (answer.type) {
    // case QuestionnaireQuestionType.TEXT:
    //   return answer.value || "No answer"
    case QuestionnaireQuestionType.SINGLE_SELECT: {
      const option = question.options.find((o) => o.value === answer.value)
      return option?.label ?? answer.value ?? "No answer"
    }
    case QuestionnaireQuestionType.MULTI_SELECT: {
      if (!answer.values.length) return "No answer"
      const labels = answer.values.map(
        (v) => question.options.find((o) => o.value === v)?.label ?? v
      )
      return labels.join(", ")
    }
    case QuestionnaireQuestionType.TRUE_FALSE:
      if (answer.value === null) return "No answer"
      return answer.value ? (question.trueLabel ?? "True") : (question.falseLabel ?? "False")
    // case QuestionnaireQuestionType.RATING:
    //   return answer.value ? `${answer.value} / 5` : "No answer"
    // case QuestionnaireQuestionType.SCALE:
    //   return answer.value !== null ? String(answer.value) : "No answer"
    default:
      return "No answer"
  }
}

export function formatAnswerType(answer: z.input<typeof attemptSchema>["answers"][number]): string {
  switch (answer.type) {
    // case QuestionnaireQuestionType.TEXT:
    //   return "Text"
    case QuestionnaireQuestionType.SINGLE_SELECT: {
      return "Multiple Choice"
    }
    case QuestionnaireQuestionType.MULTI_SELECT: {
      return "Checkbox"
    }
    case QuestionnaireQuestionType.TRUE_FALSE:
      return "True / False"
    // case QuestionnaireQuestionType.RATING:
    //   return "Rating"
    // case QuestionnaireQuestionType.SCALE:
    //   return "Scale"
    default:
      return "No answer"
  }
}
