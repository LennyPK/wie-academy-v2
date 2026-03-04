import { withForm } from "@/components/form"
import { Field, FieldError, FieldSet } from "@/components/ui/field"
import { formOptions } from "@tanstack/react-form"
import { Star } from "lucide-react"
import * as z from "zod"

const formOpts = formOptions({
  defaultValues: {
    answers: [] as Array<{ questionId: string; type: "RATING"; value: number }>,
  },
})

const MAX_RATING = 5

export const RatingAnswer = withForm({
  ...formOpts,
  props: { questionIndex: 0 },
  render: ({ form, questionIndex }) => {
    return (
      <form.Field
        name={`answers[${questionIndex}].value`}
        validators={{
          onChange: z
            .int("Please select an option")
            .min(1, "Please select a valid option")
            .max(5, "Please select a valid option"),
        }}
      >
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

          return (
            <Field data-invalid={isInvalid}>
              <FieldSet className="flex w-full flex-row justify-center">
                {Array.from({ length: MAX_RATING }, (_, i) => i + 1).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => field.handleChange(val)}
                    aria-label={`${val} star${val > 1 ? "s" : ""}`}
                    aria-pressed={field.state.value === val}
                    className="transition-colors"
                  >
                    <Star
                      className={
                        field.state.value !== undefined && val <= (field.state.value as number)
                          ? "fill-primary text-primary"
                          : "fill-none text-muted-foreground"
                      }
                    />
                  </button>
                ))}
              </FieldSet>
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      </form.Field>
    )
  },
})
