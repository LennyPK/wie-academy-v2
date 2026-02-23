import { withFieldGroup } from "@/components/form"
import { FieldGroup } from "@/components/ui/field"
import * as z from "zod"

export const passwordsSchema = z
  .object({
    password: z.string().min(6, "Password should be at least 6 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  })

const defaultValues: z.infer<typeof passwordsSchema> = {
  password: "",
  confirmPassword: "",
}

export const PasswordFields = withFieldGroup({
  defaultValues,
  render: function Render({ group }) {
    // const canSubmit = useStore(group.form.store, (state) => state.canSubmit)

    return (
      <FieldGroup>
        <group.AppField name="password">
          {(field) => {
            return (
              <field.TextField
                type="password"
                label="Password"
                placeholder="******"
                className="text-sm"
              />
            )
          }}
        </group.AppField>

        <group.AppField name="confirmPassword">
          {(field) => {
            return (
              <field.TextField
                type="password"
                label="Confirm Password"
                placeholder="******"
                className="text-sm"
              />
            )
          }}
        </group.AppField>
      </FieldGroup>
    )
  },
})
