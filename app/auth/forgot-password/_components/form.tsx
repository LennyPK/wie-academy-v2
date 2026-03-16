"use client"

import { useAppForm } from "@/components/form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription } from "@/components/ui/field"
import { authClient } from "@/lib/auth/client"
import { ROUTES } from "@/lib/constants"
import { revalidateLogic } from "@tanstack/react-form"
import { Mail } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { formSchema } from "./form-schema"

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useAppForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onDynamic: formSchema,
    },
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "change",
    }),
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      toast.loading("Sending password reset email...")

      await authClient.requestPasswordReset({
        email: value.email,
        redirectTo: ROUTES.RESET_PASSWORD,
      })

      toast.dismiss()
      toast.success("Check your inbox", {
        description: "If an account is linked to that email, you'll receive a reset link shortly.",
      })
      setIsLoading(false)
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset Your Password</CardTitle>
        <CardDescription>
          Enter your email below to receive password reset instructions.
        </CardDescription>
        <FieldDescription>
          Trying to sign in?{" "}
          <a href={ROUTES.SIGN_IN} className="text-primary">
            Sign in
          </a>
        </FieldDescription>
      </CardHeader>
      <CardContent>
        <form
          id="forgot-password-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="flex w-full flex-col gap-5"
        >
          <form.AppField name="email">
            {(field) => {
              return <field.TextField label="Email" placeholder="user@example.com" />
            }}
          </form.AppField>

          <Field>
            <Button type="submit" className="w-full" disabled={isLoading}>
              <Mail className="mr-2 h-4 w-4" />
              Send Reset Link
            </Button>
          </Field>
        </form>
      </CardContent>
    </Card>
  )
}
