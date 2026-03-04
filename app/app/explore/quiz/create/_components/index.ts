import { FormQuestionType } from "@/lib/prisma/enums"
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
      type: FormQuestionType.SINGLE_SELECT,
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
      type: FormQuestionType.SINGLE_SELECT,
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

export const formOpts = formOptions({
  defaultValues: initialValues,
})
