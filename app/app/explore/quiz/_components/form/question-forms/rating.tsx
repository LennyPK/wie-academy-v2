import { withForm } from "@/components/form"
import { FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { formOpts } from "@/explore/quiz/_components/form/options"
import { Star } from "lucide-react"

const MAX_RATING = 5

export const RatingQuestion = withForm({
  ...formOpts(),
  props: { questionIndex: 0 },
  render: ({ form, questionIndex }) => {
    return (
      <form.Field name={`questions[${questionIndex}].targetValue`}>
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

          return (
            <FieldGroup>
              <FieldLabel>Target Rating</FieldLabel>

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
                        field.state.value !== undefined && val <= field.state.value
                          ? "fill-primary text-primary"
                          : "fill-none text-muted-foreground"
                      }
                    />
                  </button>
                ))}
              </FieldSet>

              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </FieldGroup>
          )
        }}
      </form.Field>
    )
  },
})
