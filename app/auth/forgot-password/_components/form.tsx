"use client"

import { useAppForm } from "@/components/form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription } from "@/components/ui/field"
import { ROUTES } from "@/lib/constants"
import { revalidateLogic } from "@tanstack/react-form"
import { Clock, Mail } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { sendPasswordResetEmail } from "../actions"
import { formSchema } from "./form-schema"

const COOLDOWN_SECONDS = 60

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) clearInterval(timer)
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

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

      const result = await sendPasswordResetEmail(value.email)

      toast.dismiss()

      if (result.error) {
        toast.error(`Please wait ${result.remainingSeconds}s before requesting another reset link.`)
        setCooldown(result.remainingSeconds)
        setIsLoading(false)
        return
      }

      toast.success("Check your inbox", {
        description: "If an account is linked to that email, you'll receive a reset link shortly.",
      })
      setCooldown(COOLDOWN_SECONDS)
      setIsLoading(false)
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forgot Your Password?</CardTitle>
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
            <Button type="submit" className="w-full" disabled={isLoading || cooldown > 0}>
              {cooldown > 0 ? (
                <>
                  <Clock className="mr-2 h-4 w-4" />
                  {`Resend in ${cooldown}s`}
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Reset Link
                </>
              )}
            </Button>
          </Field>
        </form>
      </CardContent>
    </Card>
  )
}
