import * as z from "zod"

export const replyFormSchema = z.object({
  content: z.string().trim().min(1, "Content is required"),
  isAnonymous: z.boolean(),
})
