import { withForm } from "@/components/form"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Toggle } from "@/components/ui/toggle"
import { formOpts } from "@/explore/quiz/_components/form/options"
import { QuestionnaireQuestionType } from "@/prisma/enums"

export const ScaleQuestion = withForm({
  ...formOpts,
  props: { questionIndex: 0 },
  render: ({ form, questionIndex }) => {
    return (
      <FieldGroup>
        {/* Min / Max range inputs */}
        <FieldGroup className="flex flex-row gap-4">
          <form.AppField name={`questions[${questionIndex}].minValue`}>
            {(field) => {
              return (
                <field.TextField
                  type="number"
                  label="Minimum"
                  placeholder="1"
                  onChange={(e) => {
                    const val = parseInt(e.target.value)
                    if (isNaN(val)) return // reject non-numeric input, don't update

                    field.handleChange(val)

                    // Clear target if it falls below the new min
                    const question = form.getFieldValue(`questions[${questionIndex}]`)
                    if (
                      question.type === QuestionnaireQuestionType.SCALE &&
                      question.targetValue < val
                    ) {
                      // clamp target to new min rather than clearing it
                      form.setFieldValue(`questions[${questionIndex}].targetValue`, val)
                    }
                  }}
                  className="text-sm"
                />
              )
            }}
          </form.AppField>

          <form.AppField name={`questions[${questionIndex}].maxValue`}>
            {(field) => {
              return (
                <field.TextField
                  type="number"
                  label="Maximum"
                  placeholder="10"
                  onChange={(e) => {
                    const val = parseInt(e.target.value)
                    if (isNaN(val)) return // reject non-numeric input, don't update

                    field.handleChange(val)

                    // Clear target if it falls above the new max
                    const question = form.getFieldValue(`questions[${questionIndex}]`)
                    if (
                      question.type === QuestionnaireQuestionType.SCALE &&
                      question.targetValue > val
                    ) {
                      // clamp target to new max rather than clearing it
                      form.setFieldValue(`questions[${questionIndex}].targetValue`, val)
                    }
                  }}
                  className="text-sm"
                />
              )
            }}
          </form.AppField>
        </FieldGroup>

        {/* Optional endpoint labels — displayed to respondents on either side of the scale */}
        <FieldGroup className="flex flex-row gap-4">
          <form.AppField name={`questions[${questionIndex}].minLabel`}>
            {(field) => {
              return (
                <field.TextField
                  type="text"
                  label="Minimum Label"
                  placeholder="Not at all"
                  className="text-sm"
                />
              )
            }}
          </form.AppField>

          <form.AppField name={`questions[${questionIndex}].maxLabel`}>
            {(field) => {
              return (
                <field.TextField
                  type="text"
                  label="Maximum Label"
                  placeholder="Very much"
                  className="text-sm"
                />
              )
            }}
          </form.AppField>
        </FieldGroup>

        {/* Target value row — same pattern as original RatingQuestion but
            driven by dynamic min/max rather than a fixed 1-5 range. */}
        <form.Subscribe
          selector={(state) => {
            const question = state.values.questions[questionIndex]
            if (!question || question.type !== QuestionnaireQuestionType.SCALE) {
              return { min: null, max: null, target: null }
            }
            return {
              min: question.minValue ?? null,
              max: question.maxValue ?? null,
              target: question.targetValue ?? null,
            }
          }}
        >
          {({ min, max, target }) => {
            const isRangeValid = min !== null && max !== null && max > min
            const rangeSize = isRangeValid ? max - min + 1 : 0
            const isTooLarge = rangeSize > 20

            return (
              <Field>
                <FieldLabel>Target Value</FieldLabel>
                {!isRangeValid && (
                  <p className="text-sm text-muted-foreground">
                    Set a valid min and max to pick a target value.
                  </p>
                )}
                {isRangeValid && isTooLarge && (
                  <p className="text-sm text-destructive">
                    Range too large to display — keep max - min at 20 or fewer.
                  </p>
                )}
                {isRangeValid && !isTooLarge && (
                  <FieldGroup className="flex w-full flex-row flex-wrap justify-center gap-2">
                    {Array.from({ length: rangeSize }, (_, i) => min + i).map((val) => (
                      <Toggle
                        key={val}
                        variant="outline"
                        pressed={target === val}
                        onPressedChange={(pressed) => {
                          if (pressed) {
                            form.setFieldValue(`questions[${questionIndex}].targetValue`, val)
                          }
                        }}
                        className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                      >
                        {val}
                      </Toggle>
                    ))}
                  </FieldGroup>
                )}
              </Field>
            )
          }}
        </form.Subscribe>

        <form.Field name={`questions[${questionIndex}].targetValue`}>
          {(field) => <FieldError errors={field.state.meta.errors} />}
        </form.Field>
      </FieldGroup>
    )
  },
})
