import { withFieldGroup } from "@/components/form"
import { FieldGroup } from "@/components/ui/field"
import { QuestionnaireQuestionType } from "@/lib/prisma/enums"
import * as z from "zod"

export const textQuestionSchema = z.object({
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

  type: z.literal(QuestionnaireQuestionType.TEXT),
})

const initialValues: z.infer<typeof textQuestionSchema> = {
  tempId: crypto.randomUUID(),
  prompt: "",
  score: 0,
  isRequired: true,
  order: 0,
  type: QuestionnaireQuestionType.TEXT,
}

export const TextQuestion = withFieldGroup({
  defaultValues: initialValues,
  render: function Render({}) {
    return <FieldGroup></FieldGroup>
  },
})
