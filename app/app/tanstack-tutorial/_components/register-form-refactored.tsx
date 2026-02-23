"use client"

import { useAppForm } from "@/components/form"
import { PasswordFields } from "@/components/form/shared/password-fields"
import { FieldGroup } from "@/components/ui/field"
import { revalidateLogic, useStore } from "@tanstack/react-form"
import { toast } from "sonner"
import { formOpts } from "./form"
import { AddressField } from "./form/address-field"
import { formSchema } from "./form/form-schema"
import { SkillsField } from "./form/skills-field"

export default function RegisterForm() {
  const form = useAppForm({
    ...formOpts,
    validators: {
      // onChange: formSchema,
      onDynamic: formSchema,
    },
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "change",
    }),
    onSubmit: ({ value, meta }) => {
      console.log(value)
      // console.log(formSchema.parse(value))
      console.log(meta)
      toast.success("Submitted")
    },
  })
  const values = useStore(form.store, (state) => state)

  return (
    <form.AppForm>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit({ key: "value" })
        }}
      >
        <pre className="text-xs">{JSON.stringify(values, null, 2)}</pre>
        <FieldGroup>
          <form.AppField name="firstName">
            {(field) => {
              return (
                <field.TextField
                  type="text"
                  label="First Name"
                  placeholder="John"
                  className="text-sm"
                />
              )
            }}
          </form.AppField>

          <form.AppField name="lastName">
            {(field) => {
              return (
                <field.TextField
                  type="text"
                  label="Last Name"
                  placeholder="Smith"
                  className="text-sm"
                />
              )
            }}
          </form.AppField>

          <form.AppField name="age">
            {(field) => {
              return (
                <field.TextField type="number" label="Age" placeholder="20" className="text-sm" />
              )
            }}
          </form.AppField>

          <form.AppField name="age">
            {(field) => {
              return (
                <field.TextField
                  type="email"
                  label="Email"
                  placeholder="email@example.com"
                  className="text-sm"
                />
              )
            }}
          </form.AppField>

          <PasswordFields
            form={form}
            fields={{ password: "password", confirmPassword: "confirmPassword" }}
          />

          <AddressField form={form} />

          <SkillsField form={form} />

          <form.AppField name="acceptTerms">
            {(field) => {
              return <field.CheckboxField label="Accept Terms" />
            }}
          </form.AppField>

          <form.SubmitButton label="Submit" />
        </FieldGroup>
      </form>
    </form.AppForm>
  )
}
