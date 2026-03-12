import { withForm } from "@/components/form"
import { Field, FieldError, FieldGroup, FieldSet } from "@/components/ui/field"
import { Toggle } from "@/components/ui/toggle"
import { cn } from "@/utils"
import { formOptions } from "@tanstack/react-form"
import * as z from "zod"

const formOpts = formOptions({
  defaultValues: {
    answers: [] as Array<{ questionId: string; type: "SCALE"; value: number | null }>,
  },
})

export const ScaleAnswer = withForm({
  ...formOpts,
  props: {
    questionIndex: 0,
    min: 1,
    max: 10,
    minLabel: "Minimum",
    maxLabel: "Maximum",
  },
  render: ({ form, questionIndex, min, max, minLabel, maxLabel }) => {
    return (
      <form.Field
        name={`answers[${questionIndex}].value`}
        validators={{
          onChange: z
            .int()
            .nullable()
            .refine((val) => val !== null, { message: "Please select an option" }),
        }}
      >
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          const range = max - min + 1

          return (
            <Field data-invalid={isInvalid}>
              <FieldSet className="flex w-full flex-row items-center justify-center">
                <span>{minLabel ?? "Minimum"}</span>
                <FieldGroup className="flex flex-row flex-wrap justify-center">
                  {Array.from({ length: range }, (_, i) => i + 1).map((val) => (
                    <Toggle
                      key={val}
                      variant="outline"
                      pressed={field.state.value === val}
                      onPressedChange={(pressed) => {
                        if (pressed) field.handleChange(val)
                      }}
                      className={cn(
                        "rounded-full",
                        "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
                        "hover:cursor-pointer"
                      )}
                    >
                      {val}
                    </Toggle>
                  ))}
                </FieldGroup>
                <span>{maxLabel ?? "Maximum"}</span>
              </FieldSet>
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      </form.Field>
    )
  },
})
