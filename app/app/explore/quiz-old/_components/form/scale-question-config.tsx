"use client"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type ScaleQuestionConfigProps = {
  questionIndex: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
}

export default function ScaleQuestionConfig({ questionIndex, form }: ScaleQuestionConfigProps) {
  return (
    <>
      {/* Min and Max Values */}
      <div className="grid grid-cols-2 gap-4">
        <form.Field name={`questions[${questionIndex}].minValue`}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(field: any) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Min Value</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  placeholder="0"
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(e.target.value ? Number(e.target.value) : undefined)
                  }
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field name={`questions[${questionIndex}].maxValue`}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(field: any) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Max Value</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  placeholder="10"
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(e.target.value ? Number(e.target.value) : undefined)
                  }
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>
      </div>

      {/* Step */}
      <form.Field name={`questions[${questionIndex}].step`}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {(field: any) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Step</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                min="1"
                placeholder="1"
                value={field.state.value || 1}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                aria-invalid={isInvalid}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      </form.Field>

      {/* Labels */}
      <div className="grid grid-cols-2 gap-4">
        <form.Field name={`questions[${questionIndex}].minLabel`}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(field: any) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Min Label (Optional)</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder="e.g., Not at all"
                  value={field.state.value || ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field name={`questions[${questionIndex}].maxLabel`}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(field: any) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Max Label (Optional)</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder="e.g., Very much"
                  value={field.state.value || ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>
      </div>

      {/* Correct Value (Optional) */}
      <form.Field name={`questions[${questionIndex}].correctValue`}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {(field: any) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          const minValue = form.getFieldValue(`questions[${questionIndex}].minValue`) || 0
          const maxValue = form.getFieldValue(`questions[${questionIndex}].maxValue`) || 10
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Correct Value (Optional)</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                min={minValue}
                max={maxValue}
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
