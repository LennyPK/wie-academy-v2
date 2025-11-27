"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { routes } from "@/lib/utils/routes"
import Image from "next/image"

export default function SignInForm({ className, ...props }: React.ComponentProps<"div">) {
  // TODO: Handle form submission and validation with zod schema

  return (
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
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  className="text-sm"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  {/* FIXME: Add forgot password link*/}
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </Field>
              <Field>
                <Button type="submit" className="cursor-pointer">
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
