"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Plus, X } from "lucide-react"

type TextQuestionConfigProps = {
  questionIndex: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
}

export default function TextQuestionConfig({ questionIndex, form }: TextQuestionConfigProps) {
  return (
    <>
      {/* Placeholder */}
      <form.Field name={`questions[${questionIndex}].placeholder`}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {(field: any) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Placeholder (Optional)</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                type="text"
                placeholder="Enter placeholder text"
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

      {/* Max Length */}
      <form.Field name={`questions[${questionIndex}].maxLength`}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {(field: any) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Max Length (Optional)</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                min="1"
                placeholder="No limit"
                value={field.state.value || ""}
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

      {/* Acceptable Answers Array */}
      <form.Field name={`questions[${questionIndex}].acceptableAnswers`} mode="array">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {(field: any) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <div className="space-y-3">
              <FieldLabel>Acceptable Answers</FieldLabel>

              {field.state.value.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (_: any, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    <form.Field name={`questions[${questionIndex}].acceptableAnswers[${i}]`}>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {(answerField: any) => {
                        const answerInvalid =
                          answerField.state.meta.isTouched && !answerField.state.meta.isValid
                        return (
                          <div className="flex-1">
                            <Input
                              placeholder={`Answer ${i + 1}`}
                              value={answerField.state.value}
                              onChange={(e) => answerField.handleChange(e.target.value)}
                              onBlur={answerField.handleBlur}
                              aria-invalid={answerInvalid}
                            />
                            {answerInvalid && <FieldError errors={answerField.state.meta.errors} />}
                          </div>
                        )
                      }}
                    </form.Field>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => field.removeValue(i)}
                      disabled={field.state.value.length <= 1}
                      className="mt-1"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )
              )}

              <Button type="button" variant="outline" size="sm" onClick={() => field.pushValue("")}>
                <Plus className="mr-2 h-4 w-4" />
                Add Answer
              </Button>

              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </div>
          )
        }}
      </form.Field>

      {/* Case Sensitive */}
      <form.Field name={`questions[${questionIndex}].caseSensitive`}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {(field: any) => (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={field.state.value}
              onCheckedChange={(checked) => field.handleChange(checked === true)}
            />
            <span className="text-sm">Case sensitive matching</span>
          </div>
        )}
      </form.Field>
    </>
  )
}
