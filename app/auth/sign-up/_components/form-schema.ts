import * as z from "zod"

export const formSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.email("Enter a valid email address"),
    school: z.string().min(1, "Please select a school"),
    region: z.string().min(1, "Please select a region"),
    yearLevel: z.string().min(1, "Year level is required"),
    dob: z.date().refine((val) => !!val, {
      message: "Date of birth is required",
    }),
    password: z
      .string()
      .nonempty("Password is required")
      .min(8, "Password must be at least 8 characters"),
    // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    // .regex(/[0-9]/, "Password must contain at least one number")
    // .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().nonempty("Please confirm your password"),
    consent: z.boolean().refine((val) => val === true),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
