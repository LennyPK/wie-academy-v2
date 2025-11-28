"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { routes } from "@/constants"
import { authClient } from "@/lib/auth/client"
import { cn } from "@/lib/utils"
import { useForm } from "@tanstack/react-form"
import Image from "next/image"
import Link from "next/link"
import { useTransition } from "react"
import { toast } from "sonner"
import * as z from "zod"

const formSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().nonempty("Password is required"),
  rememberMe: z.boolean(),
})

export default function SignInForm({ className, ...props }: React.ComponentProps<"div">) {
  const [isTransitioning, startTransition] = useTransition()

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
      startTransition(async () => {
        await authClient.signIn.email(
          {
            email: value.email,
            password: value.password,
            callbackURL: "/dashboard",
          },
          {
            onRequest: () => {
              toast.loading("Loading your account...")
            },
            onSuccess: () => {
              toast.success("Successful sign in.")
            },
            onError: (ctx) => {
              toast.error(ctx.error.message)
            },
          }
        )
      })
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
                <Button type="submit" className="cursor-pointer" disabled={isTransitioning}>
                  Sign In
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href={routes.SIGN_UP}>Sign up</a>
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
