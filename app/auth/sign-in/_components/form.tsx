"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ROUTES } from "@/constants"
import { authClient } from "@/lib/auth/client"
import { cn } from "@/lib/utils"
import { useForm } from "@tanstack/react-form"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { formSchema } from "./form-schema"

export default function SignInForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true)

      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
          callbackURL: ROUTES.DASHBOARD,
        },
        {
          onRequest: () => {
            toast.loading("Loading your account...")
          },
          onSuccess: () => {
            toast.dismiss()
            toast.success("Successful sign in.")
          },
          onError: (ctx) => {
            toast.dismiss()

            if (ctx.error.code === "EMAIL_NOT_VERIFIED") {
              toast.error(`${ctx.error.message}. Please check your inbox for a verification email.`)
              document.cookie = `pending_email=${encodeURIComponent(value.email)}; max-age=3600; path=/; samesite=lax`
              router.push(ROUTES.VERIFY_EMAIL)
              return
            }

            toast.error(ctx.error.message)
            setIsLoading(false)
          },
        }
      )
    },
  })

  return (
    // TODO: Max length for email and password fields?
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <Image
            className="mx-auto"
            src="/logo.svg"
            alt="Women in Engineering Academy"
            width={75}
            height={75}
            priority
          />
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your Academy account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="sign-in-form"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldGroup>
              <form.Field name="email">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        placeholder="email@example.com"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        className="text-sm"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </form.Field>

              <form.Field name="password">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="password"
                        placeholder="********"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </form.Field>

              <div className="flex justify-between">
                {/* TODO: Add remember me functionality */}
                {/* <form.Field name="rememberMe">
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

                    return (
                      <Field orientation="horizontal" data-invalid={isInvalid}>
                        <Checkbox
                          id={field.name}
                          name={field.name}
                          checked={field.state.value}
                          onCheckedChange={(checked) => field.handleChange(checked === true)}
                          aria-invalid={isInvalid}
                        />
                        <FieldLabel htmlFor={field.name} className="text-sm font-normal">
                          Remember Me?
                        </FieldLabel>
                      </Field>
                    )
                  }}
                </form.Field> */}

                {/* TODO: Add forgot password link */}
                <Link href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                  Forgot your password?
                </Link>
              </div>

              <Field>
                <Button type="submit" disabled={isLoading}>
                  Sign In
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href={ROUTES.SIGN_UP}>Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      {/* FIXME: Add Privacy Policy and Terms of Service links*/}
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
