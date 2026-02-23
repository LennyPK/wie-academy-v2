"use client"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
type YesNoQuestionConfigProps = {
  questionIndex: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
}

export default function YesNoQuestionConfig({ questionIndex, form }: YesNoQuestionConfigProps) {
  return (
    <form.Field name={`questions[${questionIndex}].correctAnswer`}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {(field: any) => {
        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
        return (
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>Correct Answer</FieldLabel>
            <Select
              name={field.name}
              value={field.state.value === true ? "yes" : field.state.value === false ? "no" : ""}
              onValueChange={(value) => field.handleChange(value === "yes")}
            >
              <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                <SelectValue placeholder="Select correct answer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
            {isInvalid && <FieldError errors={field.state.meta.errors} />}
          </Field>
        )
      }}
    </form.Field>
  )
}
