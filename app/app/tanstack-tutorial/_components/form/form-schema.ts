import { passwordsSchema } from "@/components/form/shared/password-fields"
import * as z from "zod"

export const formSchema = z
  .object({
    firstName: z.string().min(2, "First name should be at least 2 characters.").max(50),
    lastName: z.string().min(2, "Last name should be at least 2 characters.").max(50),
    age: z
      .number()
      .min(18, "You must be at least 18 years old.")
      .max(120, "Age must be less than 120.")
      .optional(),
    email: z.email("Invalid email address.").optional(),
    // password: z.string().min(6, "Password should be at least 6 characters."),
    // confirmPassword: z.string(),
    address: z.object({
      street: z.string().min(5, "Street should be at least 5 characters."),
      city: z.string().min(2, "City should be at least 2 characters.").optional(),
      state: z.string().min(2, "State should be at least 2 characters.").optional(),
      zipCode: z.string().min(5, "Zip Code should be at least 5 characters.").optional(),
    }),
    skills: z.array(
      z.object({
        name: z.string().nonempty("Skill name cannot be empty"),
        id: z.string(),
        level: z.enum(["beginner", "intermediate", "expert"]),
      })
    ),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions.",
    }),
  })
  .and(passwordsSchema)
// .refine((data) => data.password === data.confirmPassword, {
//   error: "Passwords do not match",
//   path: ["confirmPassword"],
// })
// .transform((data) => ({
//   ...data,
//   skills: data.skills.map((skill) => skill.id),
// }))
