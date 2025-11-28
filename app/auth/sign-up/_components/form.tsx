"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePicker } from "@/components/ui/date-picker"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { regions, routes, yearLevels } from "@/constants"
import { authClient } from "@/lib/auth/client"
import { cn } from "@/lib/utils"
import { useForm } from "@tanstack/react-form"
import { getYear } from "date-fns"
import Image from "next/image"
import { useTransition } from "react"
import { toast } from "sonner"
import * as z from "zod"

const formSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.email("Enter a valid email address"),
    school: z.string().min(1, "Please select a school"),
    region: z.string().min(1, "Please select a region"),
    yearLevel: z.string().min(1, "Year level is required"),
    dob: z
      .date()
      .nullable()
      .refine((val) => val !== null, {
        message: "Date of birth is required",
      }),
    password: z
      .string()
      .nonempty("Password is required")
      .min(8, "Password must be at least 8 characters"),
    // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    // .regex(/[0-9]/, "Password must contain at least one number")
    // .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().nonempty("Please confirm your password"),
    consent: z.boolean().refine((val) => val === true),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export default function SignUpForm({ className, ...props }: React.ComponentProps<"div">) {
  const [isTransitioning, startTransition] = useTransition()

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      school: "",
      region: "",
      yearLevel: "",
      dob: null as Date | null,
      password: "",
      confirmPassword: "",
      consent: false,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        // TOOD: Handle additional fields and redirect
        await authClient.signUp.email(
          {
            email: value.email,
            password: value.password,
            name: `${value.firstName} ${value.lastName}`,
            // image: null,
            callbackURL: "/dashboard",
          },
          {
            onRequest: () => {
              toast.loading("Creating your account...")
            },
            onSuccess: () => {
              toast.success("Check your email to verify your account.")
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
    // TODO: Max length for fields?
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
          <CardTitle className="text-xl">Join the Academy</CardTitle>
          <CardDescription>Create your account to start your journey</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="sign-up-form"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldGroup className="gap-3">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <form.Field name="firstName">
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="text"
                          placeholder="John"
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

                <form.Field name="lastName">
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="text"
                          placeholder="Doe"
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
              </div>

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

              <form.Field name="school">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>School</FieldLabel>
                      <Select
                        name={field.name}
                        value={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        <SelectTrigger
                          id={field.name}
                          aria-invalid={isInvalid}
                          className="cursor-pointer"
                        >
                          <SelectValue placeholder="Select School" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="school-1">School 1</SelectItem>
                          <SelectItem value="school-2">School 2</SelectItem>
                          <SelectItem value="school-3">School 3</SelectItem>
                          <SelectItem value="school-4">School 4</SelectItem>
                          <SelectItem value="school-5">School 5</SelectItem>
                        </SelectContent>
                      </Select>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </form.Field>

              <form.Field name="region">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Region</FieldLabel>
                      <Select
                        name={field.name}
                        value={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        <SelectTrigger
                          id={field.name}
                          aria-invalid={isInvalid}
                          className="cursor-pointer"
                        >
                          <SelectValue placeholder="Select Region" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((region) => (
                            <SelectItem key={region.value} value={region.value}>
                              {region.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </form.Field>

              <form.Field name="yearLevel">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Year Level</FieldLabel>
                      <Select
                        name={field.name}
                        value={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        <SelectTrigger
                          id={field.name}
                          aria-invalid={isInvalid}
                          className="cursor-pointer"
                        >
                          <SelectValue placeholder="Select Year Level" />
                        </SelectTrigger>
                        <SelectContent>
                          {yearLevels.map((year) => (
                            <SelectItem key={year.value} value={year.value}>
                              {year.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </form.Field>

              <form.Field name="dob">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Date of Birth</FieldLabel>
                      <DatePicker
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        disableFutureDates
                        endYear={getYear(new Date())}
                        aria-invalid={isInvalid}
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

              <form.Field name="confirmPassword">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
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

              <form.Field name="consent">
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
                        I confirm that I am over 16 and/or have my parent/guardian&apos;s permission
                        to join this academy.
                      </FieldLabel>
                    </Field>
                  )
                }}
              </form.Field>

              <Field>
                <Button type="submit" className="cursor-pointer" disabled={isTransitioning}>
                  Sign Up
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <a href={routes.SIGN_IN}>Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      {/* FIXME: Add Privacy Policy and Terms of Service links*/}
      <FieldDescription className="px-6 text-center">
        By signing up, you agree to our <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
