import { formOptions } from "@tanstack/react-form"
import * as z from "zod"
import { formSchema } from "./form-schema"

export const defaultValues: z.infer<typeof formSchema> = {
  firstName: "",
  lastName: "",
  age: undefined,
  email: "",
  password: "",
  confirmPassword: "",
  address: { street: "", city: "", state: "", zipCode: "" },
  skills: [
    { name: "HTML", id: crypto.randomUUID(), level: "beginner" },
    { name: "CSS", id: crypto.randomUUID(), level: "beginner" },
    { name: "JavaScript", id: crypto.randomUUID(), level: "beginner" },
  ],
  acceptTerms: false,
}

export const formOpts = formOptions({
  defaultValues,
})
