"use client"

import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ROUTES } from "@/constants"
import { authClient } from "@/lib/auth/client"
import { useForm } from "@tanstack/react-form"
import { RefreshCw } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { formSchema } from "./form-schema"

interface VerifyFormProps {
  email: string
}

export default function VerifyForm({ email }: VerifyFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    defaultValues: {
      email: email,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      toast.loading("Sending verification email...")

      await authClient.sendVerificationEmail({
        email: value.email,
        callbackURL: ROUTES.DASHBOARD,
      })

      toast.dismiss()
      toast.success("Verification email sent.")
      setIsLoading(false)
    },
  })

  return (
    <form
      id="verify-form"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="flex w-full flex-col gap-5"
    >
      <form.Field name="email">
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <Input
                id={field.name}
                name={field.name}
                type="email"
                readOnly
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                aria-invalid={isInvalid}
                className="text-center text-sm"
                disabled
              />
            </Field>
          )
        }}
      </form.Field>

      <Field>
        <Button type="submit" className="w-full" disabled={isLoading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Resend Verification Email
        </Button>
      </Field>
    </form>
  )
}
