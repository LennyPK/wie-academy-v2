"use client"

import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ROUTES } from "@/constants"
import { authClient } from "@/lib/auth/client"
import { useForm } from "@tanstack/react-form"
import { Clock, Mail } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { formSchema } from "./form-schema"

const COOLDOWN_SECONDS = 60
const STORAGE_KEY = "verify-email-last-sent"

interface VerifyFormProps {
  email: string
}

export default function VerifyForm({ email }: VerifyFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Using local storage as Better Auth does not store in Verification table
  const [cooldown, setCooldown] = useState(() => {
    try {
      const lastSent = localStorage.getItem(STORAGE_KEY)
      if (!lastSent) return 0

      const elapsed = Math.floor((Date.now() - parseInt(lastSent)) / 1000)
      const remaining = COOLDOWN_SECONDS - elapsed
      return remaining > 0 ? remaining : 0
    } catch {
      return 0
    }
  })

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

      try {
        localStorage.setItem(STORAGE_KEY, Date.now().toString())
      } catch {
        // localStorage unavailable (e.g. private browsing), cooldown won't persist
      }

      setCooldown(COOLDOWN_SECONDS)

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
        <Button type="submit" className="w-full" disabled={isLoading || cooldown > 0}>
          {cooldown > 0 ? (
            <>
              <Clock className="mr-2 h-4 w-4" />
              {`Resend in ${cooldown}s`}
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Resend Verification Email
            </>
          )}
        </Button>
      </Field>
    </form>
  )
}
