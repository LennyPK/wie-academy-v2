import { withForm } from "@/components/form"
import { Field, FieldError, FieldGroup, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Toggle } from "@/components/ui/toggle"
import { FormQuestionType } from "@/lib/prisma/enums"
import { Check } from "lucide-react"
import { formOpts } from "."

export const TrueFalseQuestion = withForm({
  ...formOpts,
  props: { questionIndex: 0 },
  render: ({ form, questionIndex }) => {
    return (
      <form.Field name={`questions[${questionIndex}].correctAnswer`}>
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

          // Subscribe to live correctAnswer so both toggles stay in sync.
          // Same pattern as single-select — driven by a single source of truth
          // rather than independent boolean state per toggle.
          return (
            <FieldGroup>
              <form.Subscribe
                selector={(state) => {
                  const question = state.values.questions[questionIndex]
                  if (!question || question.type !== FormQuestionType.TRUE_FALSE) return null
                  return question.correctAnswer
                }}
              >
                {(correctAnswer) => (
                  <FieldGroup className="flex flex-row justify-center">
                    <FieldSet className="flex flex-row items-center gap-2">
                      <Toggle
                        variant="outline"
                        pressed={correctAnswer === true}
                        onPressedChange={() => field.handleChange(true)}
                        className="rounded-full data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                        aria-label="True is correct"
                        aria-invalid={isInvalid}
                      >
                        <Check />
                      </Toggle>

                      <form.Field name={`questions[${questionIndex}].trueLabel`}>
                        {(trueLabelField) => {
                          const isInvalid =
                            trueLabelField.state.meta.isTouched &&
                            !trueLabelField.state.meta.isValid
                          return (
                            <Field>
                              <Input
                                id={trueLabelField.name}
                                name={trueLabelField.name}
                                type="text"
                                // Placeholder shows the default label so the
                                // creator knows what will be displayed if left empty.
                                placeholder="True"
                                value={trueLabelField.state.value}
                                onChange={(e) => trueLabelField.handleChange(e.target.value)}
                                onBlur={trueLabelField.handleBlur}
                              />
                              {isInvalid && (
                                <FieldError errors={trueLabelField.state.meta.errors} />
                              )}
                            </Field>
                          )
                        }}
                      </form.Field>
                    </FieldSet>

                    <FieldSet className="flex flex-row items-center gap-2">
                      <Toggle
                        variant="outline"
                        pressed={correctAnswer === false}
                        onPressedChange={() => field.handleChange(false)}
                        className="rounded-full data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                        aria-label="False is correct"
                        aria-invalid={isInvalid}
                      >
                        <Check />
                      </Toggle>

                      <form.Field name={`questions[${questionIndex}].falseLabel`}>
                        {(falseLabelField) => {
                          const isInvalid =
                            falseLabelField.state.meta.isTouched &&
                            !falseLabelField.state.meta.isValid
                          return (
                            <Field>
                              <Input
                                id={falseLabelField.name}
                                name={falseLabelField.name}
                                type="text"
                                // Placeholder shows the default label so the
                                // creator knows what will be displayed if left empty.
                                placeholder="False"
                                value={falseLabelField.state.value}
                                onChange={(e) => falseLabelField.handleChange(e.target.value)}
                                onBlur={falseLabelField.handleBlur}
                                aria-invalid={isInvalid}
                              />
                              {isInvalid && (
                                <FieldError errors={falseLabelField.state.meta.errors} />
                              )}
                            </Field>
                          )
                        }}
                      </form.Field>
                    </FieldSet>
                  </FieldGroup>
                )}
              </form.Subscribe>

              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </FieldGroup>
          )
        }}
      </form.Field>
    )
  },
})
