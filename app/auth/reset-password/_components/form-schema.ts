import * as z from "zod"

export const baseFormSchema = z.object({
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters"),
  // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  // .regex(/[0-9]/, "Password must contain at least one number")
  // .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string().nonempty("Please confirm your password"),
})

export const formSchema = baseFormSchema.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],

  // run if password & confirmPassword are valid
  when(payload) {
    return baseFormSchema.pick({ password: true, confirmPassword: true }).safeParse(payload.value)
      .success
  },
})
