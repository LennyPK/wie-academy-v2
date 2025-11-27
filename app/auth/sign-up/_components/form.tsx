"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePicker } from "@/components/ui/date-picker"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { REGIONS, YEAR_LEVELS } from "@/lib/utils/constants"
import { routes } from "@/lib/utils/routes"
import { getYear } from "date-fns"
import Image from "next/image"

export default function SignUpForm({ className, ...props }: React.ComponentProps<"div">) {
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
          <CardTitle className="text-xl">Join the Academy</CardTitle>
          <CardDescription>Create your account to start your journey</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup className="gap-3">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="first-name">First Name</FieldLabel>
                  <Input
                    id="first-name"
                    type="text"
                    placeholder="John"
                    className="text-sm"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="last-name">Last Name</FieldLabel>
                  <Input
                    id="last-name"
                    type="text"
                    placeholder="Doe"
                    className="text-sm"
                    required
                  />
                </Field>
              </div>

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
                <FieldLabel htmlFor="school">School</FieldLabel>
                <Select>
                  <SelectTrigger id="school">
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
              </Field>

              <Field>
                <FieldLabel htmlFor="region">Region</FieldLabel>
                <Select>
                  <SelectTrigger id="region">
                    <SelectValue placeholder="Select Region" />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONS.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="year-level">Year Level</FieldLabel>
                <Select>
                  <SelectTrigger id="year-level">
                    <SelectValue placeholder="Select Year Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEAR_LEVELS.map((year) => (
                      <SelectItem key={year.value} value={year.value}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="dob">Date of Birth</FieldLabel>
                <DatePicker id="dob" endYear={getYear(new Date())} disableFutureDates />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" type="password" required />
              </Field>

              <Field>
                <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                <Input id="confirm-password" type="password" required />
              </Field>

              <Field orientation="horizontal">
                <Checkbox id="consent" />
                <FieldLabel htmlFor="consent" className="text-sm font-normal">
                  I confirm that I am over 16 and/or have my parent/guardian&apos;s permission to
                  join this academy.
                </FieldLabel>
              </Field>

              <Field>
                <Button type="submit" className="cursor-pointer">
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
