import { withForm } from "@/components/form"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Toggle } from "@/components/ui/toggle"
import { FormQuestionType } from "@/lib/prisma/enums"
import { cn, slugify } from "@/lib/utils"
import { Check, Plus, Trash2 } from "lucide-react"
import { formOpts } from "."

export const SingleSelectQuestion = withForm({
  ...formOpts,
  props: { questionIndex: 0 },
  render: ({ form, questionIndex }) => {
    return (
      <form.Field name={`questions[${questionIndex}].options`} mode="array">
        {(optionsField) => {
          // Guard against the question not having options yet —
          // this happens when switching from a non-options type like TEXT.
          if (!optionsField.state.value) return null

          const optionsIsInvalid =
            optionsField.state.meta.isTouched && !optionsField.state.meta.isValid

          // We use form.getFieldValue rather than closing over optionsField.state.value
          // because event handlers (handleCorrectChange, handleDelete) are called
          // asynchronously — by the time they fire, the closed-over snapshot may be stale.
          const getOptions = () => {
            return form.getFieldValue(`questions[${questionIndex}].options`)
          }

          const handleCorrectChange = (selectedValue: string) => {
            const options = getOptions()
            // Set isCorrect on every option atomically so only one is ever true.
            options.forEach((option, i) => {
              form.setFieldValue(
                `questions[${questionIndex}].options[${i}].isCorrect`,
                option.value === selectedValue
              )
            })
          }

          const handleDelete = (index: number) => {
            const currentOptions = getOptions()

            // Instead of calling removeValue + re-indexing separately (which races
            // because removeValue is async), we replace the whole array in one
            // atomic setFieldValue — filter the deleted option out and re-index order
            // in the same pass.
            const updatedOptions = currentOptions
              .filter((_, i) => i !== index)
              .map((option, newIndex) => ({ ...option, order: newIndex }))

            // Replace the entire options array after reindexing
            form.setFieldValue(`questions[${questionIndex}].options`, updatedOptions)
          }

          return (
            <FieldGroup>
              {optionsField.state.value.map((option, index) => (
                <form.Field
                  // Use a stable option.id (set once on creation via crypto.randomUUID())
                  // rather than index or option.value so React doesn't unmount/remount
                  // the field on delete or on every keystroke as the slug changes.
                  key={`${questionIndex}-option-${option.id}`}
                  name={`questions[${questionIndex}].options[${index}].label`}
                >
                  {(labelField) => {
                    const labelIsInvalid =
                      labelField.state.meta.isTouched && !labelField.state.meta.isValid

                    return (
                      // Per-option subscribe consolidates liveValue, isDuplicate,
                      // isCorrect, and order into one selector so we only have a
                      // single subscription per row rather than multiple nested ones.
                      <form.Subscribe
                        selector={(state) => {
                          const question = state.values.questions[questionIndex]
                          if (!question || question.type !== FormQuestionType.SINGLE_SELECT) {
                            return {
                              liveValue: "",
                              isDuplicate: false,
                              isCorrect: false,
                              order: index,
                            }
                          }
                          const option = question.options[index]
                          const liveValue = option.value ?? ""
                          const isDuplicate =
                            liveValue !== "" &&
                            question.options.some((o, i) => i !== index && o.value === liveValue)

                          return {
                            liveValue,
                            isDuplicate,
                            isCorrect: option.isCorrect ?? false,
                            order: option.order,
                          }
                        }}
                      >
                        {({ liveValue, isDuplicate, isCorrect, order }) => (
                          <FieldGroup className="flex flex-row items-baseline">
                            <span className="font-medium">{order}.</span>

                            {/* Toggle enforces single-select by calling handleCorrectChange
                                which sets all options atomically — only this option gets
                                isCorrect: true, all others are set to false. */}
                            <Toggle
                              variant="outline"
                              pressed={isCorrect}
                              onPressedChange={() => handleCorrectChange(liveValue)}
                              disabled={liveValue === ""}
                              className={cn(
                                "rounded-full",
                                "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
                                "hover:cursor-pointer"
                              )}
                            >
                              <Check />
                            </Toggle>

                            <Field data-invalid={labelIsInvalid || isDuplicate}>
                              <Input
                                id={labelField.name}
                                name={labelField.name}
                                type="text"
                                placeholder="Option Label"
                                variant="default"
                                value={labelField.state.value}
                                onBlur={labelField.handleBlur}
                                onChange={(e) => {
                                  const newSlug = slugify(e.target.value)

                                  // Update the label and value first so the store reflects
                                  // the new slug before the isCorrect condition reads it.
                                  labelField.handleChange(e.target.value)
                                  form.setFieldValue(
                                    `questions[${questionIndex}].options[${index}].value`,
                                    newSlug
                                  )

                                  // Set isCorrect by index position rather than slug comparison,
                                  // avoiding a potential stale read from getOptions() if the
                                  // value setFieldValue above hasn't flushed yet.
                                  if (isCorrect) {
                                    const options = getOptions()
                                    // Set isCorrect on every option atomically so only one is ever true.
                                    options.forEach((_, i) => {
                                      form.setFieldValue(
                                        `questions[${questionIndex}].options[${i}].isCorrect`,
                                        i === index // the current index is correct, all others false
                                      )
                                    })
                                  }
                                }}
                                aria-invalid={labelIsInvalid || isDuplicate}
                              />
                              {labelIsInvalid && (
                                <FieldError errors={labelField.state.meta.errors} />
                              )}
                              {isDuplicate && (
                                <FieldError
                                  errors={[{ message: "Option labels must be unique" }]}
                                />
                              )}
                            </Field>

                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              onClick={() => handleDelete(index)}
                              className="rounded-full hover:bg-destructive hover:text-destructive-foreground"
                            >
                              <Trash2 />
                            </Button>
                          </FieldGroup>
                        )}
                      </form.Subscribe>
                    )
                  }}
                </form.Field>
              ))}

              {optionsIsInvalid && <FieldError errors={optionsField.state.meta.errors} />}

              {/* Add Option */}
              <Button
                type="button"
                variant="outline"
                className={cn("flex w-full items-center justify-center gap-2 py-4 transition-all")}
                onClick={() =>
                  optionsField.pushValue({
                    id: crypto.randomUUID(),
                    label: "",
                    value: "",
                    isCorrect: false,
                    // getOptions().length gives the correct next order index
                    // using live state rather than a stale closure snapshot.
                    order: getOptions().length,
                    score: 0,
                  })
                }
              >
                <Plus className="h-5 w-5" />
                Add Option
              </Button>
            </FieldGroup>
          )
        }}
      </form.Field>
    )
  },
})
