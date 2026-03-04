import { FormQuestionType } from "@/lib/prisma/enums"
import { formOptions } from "@tanstack/react-form"
import * as z from "zod"
import { QuizWithQuestions } from "../../../types"
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
    // case FormQuestionType.TEXT:
    //   return answer.value || "No answer"
    case FormQuestionType.SINGLE_SELECT: {
      const option = question.options.find((o) => o.value === answer.value)
      return option?.label ?? answer.value ?? "No answer"
    }
    case FormQuestionType.MULTI_SELECT: {
      if (!answer.values.length) return "No answer"
      const labels = answer.values.map(
        (v) => question.options.find((o) => o.value === v)?.label ?? v
      )
      return labels.join(", ")
    }
    case FormQuestionType.TRUE_FALSE:
      if (answer.value === null) return "No answer"
      return answer.value ? (question.trueLabel ?? "True") : (question.falseLabel ?? "False")
    // case FormQuestionType.RATING:
    //   return answer.value ? `${answer.value} / 5` : "No answer"
    // case FormQuestionType.SCALE:
    //   return answer.value !== null ? String(answer.value) : "No answer"
    default:
      return "No answer"
  }
}
