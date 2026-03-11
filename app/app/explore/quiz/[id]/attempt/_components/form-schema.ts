import { QuestionnaireQuestionType } from "@/lib/prisma/enums"
import * as z from "zod"

const baseAnswerSchema = z.object({
  questionId: z.string(),
})

// const textAnswerSchema = baseAnswerSchema.extend({
//   type: z.literal(QuestionnaireQuestionType.TEXT),
//   value: z.string().min(1, "Answer is required"),
// })

const singleSelectAnswerSchema = baseAnswerSchema.extend({
  type: z.literal(QuestionnaireQuestionType.SINGLE_SELECT),
  value: z.string().min(1, "Please select an option"),
})

const multiSelectAnswerSchema = baseAnswerSchema.extend({
  type: z.literal(QuestionnaireQuestionType.MULTI_SELECT),
  values: z.array(z.string()).min(1, "Please select at least one option"),
})

const trueFalseAnswerSchema = baseAnswerSchema.extend({
  type: z.literal(QuestionnaireQuestionType.TRUE_FALSE),
  value: z
    .boolean()
    .nullable()
    .refine((val) => val !== null, { message: "Please select an option" }),
})

// const ratingAnswerSchema = baseAnswerSchema.extend({
//   type: z.literal(QuestionnaireQuestionType.RATING),
//   value: z
//     .int("Please select an option")
//     .min(1, "Please select a valid option")
//     .max(5, "Please select a valid option"),
// })

// const scaleAnswerSchema = baseAnswerSchema.extend({
//   type: z.literal(QuestionnaireQuestionType.SCALE),
//   value: z
//     .int()
//     .nullable()
//     .refine((val) => val !== null, { message: "Please select an option" }),
// })

export const answerSchema = z.discriminatedUnion("type", [
  // textAnswerSchema,
  singleSelectAnswerSchema,
  multiSelectAnswerSchema,
  trueFalseAnswerSchema,
  // ratingAnswerSchema,
  // scaleAnswerSchema,
])

export const attemptSchema = z.object({
  answers: z.array(answerSchema),
})
