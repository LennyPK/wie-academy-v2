import { QuestionnaireQuestionType } from "@/lib/prisma/enums"
import * as z from "zod"

// ─────────────────────────────────────────
// Option (SINGLE_CHOICE, MULTI_SELECT)
// ─────────────────────────────────────────
const optionSchema = z.object({
  id: z.string().optional(),
  tempId: z.string(),
  label: z.string().trim().min(1, "Option label is required").max(200, "Option label is too long"),
  value: z.string(),
  isCorrect: z.boolean(),
  score: z.int().nonnegative(),
  order: z.int().nonnegative(),
})

// ─────────────────────────────────────────
// Question variants
// Each question type has its own schema, which are then discriminated on `type`.
// ─────────────────────────────────────────
const baseQuestionSchema = z.object({
  id: z.string().optional(),
  tempId: z.string(),
  prompt: z
    .string()
    .trim()
    .min(1, "Question prompt is required")
    .max(500, "Question prompt is too long"),
  // explanation: z.string().trim().max(1000, "Explanation is too long").optional(),
  score: z.int("Score is required").min(1, "A question must be worth at least 1 point"),
  isRequired: z.boolean(),
  order: z.int().nonnegative(),
})

const textQuestionSchema = baseQuestionSchema.extend({
  type: z.literal(QuestionnaireQuestionType.TEXT),
})

const singleSelectQuestionSchema = baseQuestionSchema
  .extend({
    type: z.literal(QuestionnaireQuestionType.SINGLE_SELECT),
    options: z.array(optionSchema).min(2, "At least 2 options are required"),
  })
  .superRefine((data, ctx) => {
    const correctCount = data.options.filter((option) => option.isCorrect).length
    if (correctCount !== 1) {
      ctx.addIssue({
        code: "custom",
        message: "Exactly one option must be marked as correct",
        path: ["options"],
      })
    }
  })

const multiSelectQuestionSchema = baseQuestionSchema
  .extend({
    type: z.literal(QuestionnaireQuestionType.MULTI_SELECT),
    options: z.array(optionSchema).min(2, "At least 2 options are required"),
  })
  .superRefine((data, ctx) => {
    const correctCount = data.options.filter((option) => option.isCorrect).length
    if (correctCount < 1) {
      ctx.addIssue({
        code: "custom",
        message: "At least one option must be marked as correct",
        path: ["options"],
      })
    }

    const totalOptionScore = data.options
      .filter((option) => option.isCorrect)
      .reduce((sum, option) => sum + option.score, 0)

    if (totalOptionScore !== data.score) {
      ctx.addIssue({
        code: "custom",
        message: `Scores awarded across correct options (${totalOptionScore}) must add up to the question's total score (${data.score})`,
        path: ["options"],
      })
    }
  })

const trueFalseQuestionSchema = baseQuestionSchema.extend({
  type: z.literal(QuestionnaireQuestionType.TRUE_FALSE),
  correctAnswer: z.boolean("Choice is required"),
  trueLabel: z.string().trim().max(100, "True label is too long").optional(),
  falseLabel: z.string().trim().max(100, "False label is too long").optional(),
})

const ratingQuestionSchema = baseQuestionSchema.extend({
  type: z.literal(QuestionnaireQuestionType.RATING),
  targetValue: z.int("Target value is required").min(1).max(5),
})

const scaleQuestionSchema = baseQuestionSchema
  .extend({
    type: z.literal(QuestionnaireQuestionType.SCALE),
    minValue: z.int(),
    maxValue: z.int(),
    targetValue: z.int("Target value is required"),
    minLabel: z.string().trim().max(100, "Minimum label is too long").optional(),
    maxLabel: z.string().trim().max(100, "Maximum label is too long").optional(),
  })
  .superRefine((data, ctx) => {
    if (data.maxValue <= data.minValue) {
      ctx.addIssue({
        code: "custom",
        message: "Max value must be greater than min value",
        path: ["maxValue"],
      })
    }
    if (data.targetValue < data.minValue || data.targetValue > data.maxValue) {
      ctx.addIssue({
        code: "custom",
        message: "Target value must be between min and max values",
        path: ["targetValue"],
      })
    }
  })

const questionSchema = z.discriminatedUnion("type", [
  textQuestionSchema,
  singleSelectQuestionSchema,
  multiSelectQuestionSchema,
  trueFalseQuestionSchema,
  ratingQuestionSchema,
  scaleQuestionSchema,
])

export const formSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().trim().min(1, "Title is required").max(100, "Title is too long"),
    description: z
      .string()
      .trim()
      // .min(1, "Description is required")
      .max(500, "Description is too long")
      .optional(),
    questions: z.array(questionSchema).min(1, "At least 1 question is required"),
    // .max(50, "Maximum 50 questions allowed"),
  })
  .superRefine((data, ctx) => {
    // Ensure `order` values are unique and contiguous (0, 1, 2...)
    const orders = data.questions.map((question) => question.order)
    const expected = Array.from({ length: orders.length }, (_, i) => i)
    const isValid = expected.every((i) => orders.includes(i))
    if (!isValid) {
      ctx.addIssue({
        code: "custom",
        message: "Question order values must be unique and contiguous starting from 0",
        path: ["questions"],
      })
    }
  })
