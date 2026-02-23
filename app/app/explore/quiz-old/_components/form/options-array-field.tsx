"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from "lucide-react"

type OptionsArrayFieldProps = {
  questionIndex: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  optionsField: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
}

export default function OptionsArrayField({
  questionIndex,
  optionsField,
  form,
}: OptionsArrayFieldProps) {
  const isInvalid = optionsField.state.meta.isTouched && !optionsField.state.meta.isValid

  return (
    <div className="space-y-3">
      <FieldLabel>Options</FieldLabel>

      {optionsField.state.value.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (_: any, j: number) => (
          <div key={j} className="flex items-start gap-2">
            {/* Option Label */}
            <form.Field name={`questions[${questionIndex}].options[${j}].label`}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(labelField: any) => {
                const labelInvalid =
                  labelField.state.meta.isTouched && !labelField.state.meta.isValid
                return (
                  <div className="flex-1">
                    <Input
                      placeholder={`Option ${j + 1}`}
                      value={labelField.state.value}
                      onChange={(e) => {
                        labelField.handleChange(e.target.value)
                        // Auto-generate value from label
                        form.setFieldValue(
                          `questions[${questionIndex}].options[${j}].value`,
                          e.target.value.toLowerCase().trim()
                        )
                      }}
                      onBlur={labelField.handleBlur}
                      aria-invalid={labelInvalid}
                    />
                    {labelInvalid && <FieldError errors={labelField.state.meta.errors} />}
                  </div>
                )
              }}
            </form.Field>

            {/* Correct Answer Checkbox */}
            <form.Field name={`questions[${questionIndex}].options[${j}].isCorrect`}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(correctField: any) => (
                <div className="flex items-center gap-2 pt-2">
                  <Checkbox
                    checked={correctField.state.value}
                    onCheckedChange={(checked) => correctField.handleChange(checked === true)}
                  />
                  <span className="text-sm text-muted-foreground">Correct</span>
                </div>
              )}
            </form.Field>

            {/* Delete Option Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => optionsField.removeValue(j)}
              disabled={optionsField.state.value.length <= 2}
              className="mt-1"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      )}

      {/* Add Option Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          optionsField.pushValue({
            label: "",
            value: "",
            orderIndex: optionsField.state.value.length,
            isCorrect: false,
          })
        }
        disabled={optionsField.state.value.length >= 10}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Option
      </Button>

      {/* Array-level validation error */}
      {isInvalid && <FieldError errors={optionsField.state.meta.errors} />}
    </div>
  )
}
