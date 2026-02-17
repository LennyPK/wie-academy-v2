import * as z from "zod"
import { FormQuestionType } from "@/lib/generated/prisma/enums"

// Common fields for all question types
const baseQuestionSchema = z.object({
  questionText: z
    .string()
    .trim()
    .min(1, "Question text is required")
    .max(500, "Question text is too long"),
  isRequired: z.boolean().default(true),
  explanation: z.string().trim().max(1000, "Explanation is too long").optional().or(z.literal("")),
  score: z.number().int().positive("Score must be positive").optional().default(1),
  orderIndex: z.number().int().min(0),
})

// Option schema for MULTICHOICE and CHECKBOX
const optionSchema = z.object({
  label: z.string().trim().min(1, "Option text is required").max(200, "Option text is too long"),
  value: z.string(), // Auto-generated from label
  orderIndex: z.number().int().min(0),
  isCorrect: z.boolean(),
})

// MULTICHOICE question schema
const multichoiceQuestionSchema = baseQuestionSchema
  .extend({
    type: z.literal(FormQuestionType.MULTICHOICE),
    options: z
      .array(optionSchema)
      .min(2, "At least 2 options are required")
      .max(10, "Maximum 10 options allowed"),
  })
  .superRefine((data, ctx) => {
    // Ensure at least one option is marked as correct
    const correctCount = data.options.filter((opt) => opt.isCorrect).length

    if (correctCount === 0) {
      ctx.addIssue({
        code: "custom",
        message: "At least one option must be marked as correct",
        path: ["options"],
      })
    }
  })

// CHECKBOX question schema (allows multiple correct answers)
const checkboxQuestionSchema = baseQuestionSchema
  .extend({
    type: z.literal(FormQuestionType.CHECKBOX),
    options: z
      .array(optionSchema)
      .min(2, "At least 2 options are required")
      .max(10, "Maximum 10 options allowed"),
  })
  .superRefine((data, ctx) => {
    // Ensure at least one option is marked as correct
    const correctCount = data.options.filter((opt) => opt.isCorrect).length

    if (correctCount === 0) {
      ctx.addIssue({
        code: "custom",
        message: "At least one option must be marked as correct",
        path: ["options"],
      })
    }
  })

// YES_NO question schema
const yesNoQuestionSchema = baseQuestionSchema.extend({
  type: z.literal(FormQuestionType.YES_NO),
  correctAnswer: z.boolean(), // true for Yes, false for No
})

// TEXT question schema
const textQuestionSchema = baseQuestionSchema.extend({
  type: z.literal(FormQuestionType.TEXT),
  placeholder: z.string().max(200, "Placeholder is too long").optional(),
  maxLength: z.number().int().positive("Max length must be positive").optional(),
  acceptableAnswers: z
    .array(z.string().trim().min(1, "Answer cannot be empty"))
    .min(1, "At least one acceptable answer is required"),
  caseSensitive: z.boolean().default(false),
})

// RATING question schema
const ratingQuestionSchema = baseQuestionSchema.extend({
  type: z.literal(FormQuestionType.RATING),
  maxRating: z.number().int().min(3, "Min 3 stars").max(10, "Max 10 stars").default(5),
  iconStyle: z.enum(["star", "heart", "thumbs"]).default("star"),
  correctRating: z.number().int().optional(), // Optional - not all ratings have "correct" answers
})

// SCALE question schema
const scaleQuestionSchema = baseQuestionSchema
  .extend({
    type: z.literal(FormQuestionType.SCALE),
    minValue: z.number().int(),
    maxValue: z.number().int(),
    step: z.number().int().positive("Step must be positive").default(1),
    minLabel: z.string().max(50, "Label is too long").optional(),
    maxLabel: z.string().max(50, "Label is too long").optional(),
    correctValue: z.number().int().optional(), // Optional - not all scales have "correct" answers
  })
  .superRefine((data, ctx) => {
    if (data.minValue >= data.maxValue) {
      ctx.addIssue({
        code: "custom",
        message: "Maximum value must be greater than minimum value",
        path: ["maxValue"],
      })
    }
  })

// Discriminated union for all question types
const questionSchema = z.discriminatedUnion("type", [
  multichoiceQuestionSchema,
  checkboxQuestionSchema,
  yesNoQuestionSchema,
  textQuestionSchema,
  ratingQuestionSchema,
  scaleQuestionSchema,
])

// Main form schema
export const formSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(100, "Title is too long"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(500, "Description is too long"),
  questions: z
    .array(questionSchema)
    .min(1, "At least 1 question is required")
    .max(50, "Maximum 50 questions allowed"),
})
