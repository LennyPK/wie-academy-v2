import * as z from "zod"

export const formSchema = z.object({
  email: z.email("Enter a valid email address"),
})
