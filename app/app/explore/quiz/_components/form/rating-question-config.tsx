"use client"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type RatingQuestionConfigProps = {
  questionIndex: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
}

export default function RatingQuestionConfig({ questionIndex, form }: RatingQuestionConfigProps) {
  return (
    <>
      {/* Max Rating */}
      <form.Field name={`questions[${questionIndex}].maxRating`}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {(field: any) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Maximum Rating</FieldLabel>
              <Select
                name={field.name}
                value={String(field.state.value || 5)}
                onValueChange={(value) => field.handleChange(Number(value))}
              >
                <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                  <SelectValue placeholder="Select max rating" />
                </SelectTrigger>
                <SelectContent>
                  {[3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} stars
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      </form.Field>

      {/* Icon Style */}
      <form.Field name={`questions[${questionIndex}].iconStyle`}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {(field: any) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Icon Style</FieldLabel>
              <Select
                name={field.name}
                value={field.state.value || "star"}
                onValueChange={field.handleChange}
              >
                <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                  <SelectValue placeholder="Select icon style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="star">⭐ Star</SelectItem>
                  <SelectItem value="heart">❤️ Heart</SelectItem>
                  <SelectItem value="thumbs">👍 Thumbs</SelectItem>
                </SelectContent>
              </Select>
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      </form.Field>

      {/* Correct Rating (Optional) */}
      <form.Field name={`questions[${questionIndex}].correctRating`}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {(field: any) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          const maxRating = form.getFieldValue(`questions[${questionIndex}].maxRating`) || 5
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Correct Rating (Optional)</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                min="1"
                max={maxRating}
                placeholder="No correct answer"
                value={field.state.value || ""}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(e.target.value ? Number(e.target.value) : undefined)
                }
                aria-invalid={isInvalid}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
              <p className="mt-1 text-xs text-muted-foreground">
                Leave empty if there&apos;s no correct answer
              </p>
            </Field>
          )
        }}
      </form.Field>
    </>
  )
}
