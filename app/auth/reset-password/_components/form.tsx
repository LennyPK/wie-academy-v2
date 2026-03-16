"use client"

import { useAppForm } from "@/components/form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription } from "@/components/ui/field"
import { authClient } from "@/lib/auth/client"
import { ROUTES } from "@/lib/constants"
import { revalidateLogic } from "@tanstack/react-form"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { formSchema } from "./form-schema"

interface ResetPasswordFormProps {
  token: string
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useAppForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
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

      await authClient.resetPassword(
        {
          newPassword: value.password,
          token,
        },
        {
          onRequest: () => {
            toast.loading("Resetting password...")
          },
          onSuccess: () => {
            toast.dismiss()
            toast.success("Password succesfully reset", { description: "Sign in again" })
            router.replace(ROUTES.SIGN_IN)
          },
          onError: (ctx) => {
            toast.dismiss()
            toast.error(ctx.error.message)
            setIsLoading(false)
          },
        }
      )
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
          id="reset-password-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="flex w-full flex-col gap-5"
        >
          <form.AppField name="password">
            {(field) => {
              return <field.TextField type="password" label="Password" placeholder="********" />
            }}
          </form.AppField>

          <form.AppField name="confirmPassword">
            {(field) => {
              return (
                <field.TextField type="password" label="Confirm Password" placeholder="********" />
              )
            }}
          </form.AppField>

          <Field>
            <Button type="submit" className="w-full" disabled={isLoading}>
              Reset Password
            </Button>
          </Field>
        </form>
      </CardContent>
    </Card>
  )
}
