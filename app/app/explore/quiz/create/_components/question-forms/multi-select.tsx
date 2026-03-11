import { withForm } from "@/components/form"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Toggle } from "@/components/ui/toggle"
import { FormQuestionType } from "@/lib/prisma/enums"
import { cn, slugify } from "@/lib/utils"
import { Check, Plus, Trash2 } from "lucide-react"
import { formOpts } from ".."

export const MultiSelectQuestion = withForm({
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

          const getOptions = () => {
            return form.getFieldValue(`questions[${questionIndex}].options`)
          }

          // Unlike single-select, toggling correct on one option is independent —
          // we just flip the one option rather than setting all atomically.
          const handleToggleCorrect = (index: number) => {
            const options = getOptions()
            const isCurrentlyCorrect = options[index].isCorrect

            form.setFieldValue(
              `questions[${questionIndex}].options[${index}].isCorrect`,
              !options[index].isCorrect
            )

            // Reset score to 0 when unmarking as correct so it doesn't
            // silently count toward the superRefine score sum check.
            if (isCurrentlyCorrect) {
              form.setFieldValue(`questions[${questionIndex}].options[${index}].score`, 0)
            }
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
                  key={`${questionIndex}-option-${option.id ?? option.tempId}`}
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
                          if (!question || question.type !== FormQuestionType.MULTI_SELECT) {
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
                          <FieldGroup
                            className={cn(
                              "flex flex-row",
                              labelIsInvalid ? "items-center" : "items-end"
                            )}
                          >
                            <Toggle
                              variant="outline"
                              pressed={isCorrect}
                              onPressedChange={() => handleToggleCorrect(index)}
                              disabled={liveValue === ""}
                              className={cn(
                                "hidden sm:block",
                                "rounded-full",
                                "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
                                "hover:cursor-pointer"
                              )}
                            >
                              <Check />
                            </Toggle>

                            <FieldGroup className="sm:flex-row">
                              <Field data-invalid={labelIsInvalid || isDuplicate}>
                                <FieldLabel htmlFor={labelField.name}>
                                  Option {order + 1} Label
                                </FieldLabel>
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

                                    // Update label and slug first so the store is
                                    // up to date before any downstream reads.
                                    labelField.handleChange(e.target.value)
                                    form.setFieldValue(
                                      `questions[${questionIndex}].options[${index}].value`,
                                      newSlug
                                    )

                                    // No need to re-sync isCorrect on label change for
                                    // multi-select — isCorrect is independent of value,
                                    // unlike single-select where the Toggle matches by value slug
                                    // and must stay in sync when the label changes.
                                  }}
                                  className="text-sm sm:text-base"
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

                              <form.Field
                                name={`questions[${questionIndex}].options[${index}].score`}
                              >
                                {(scoreField) => {
                                  const scoreIsInvalid =
                                    scoreField.state.meta.isTouched &&
                                    !scoreField.state.meta.isValid
                                  return (
                                    <Field
                                      data-invalid={scoreIsInvalid}
                                      className="w-full shrink-0 sm:w-30"
                                    >
                                      <FieldLabel htmlFor={scoreField.name}>
                                        Option {order + 1} Score
                                      </FieldLabel>
                                      <Input
                                        id={scoreField.name}
                                        name={scoreField.name}
                                        type="number"
                                        placeholder="10"
                                        min={0}
                                        value={scoreField.state.value}
                                        onBlur={scoreField.handleBlur}
                                        onChange={(e) => {
                                          const val = parseInt(e.target.value)
                                          scoreField.handleChange(isNaN(val) ? 0 : val)
                                        }}
                                        className="text-sm sm:text-base"
                                        aria-invalid={scoreIsInvalid}
                                        disabled={!isCorrect}
                                      />
                                      {scoreIsInvalid && (
                                        <FieldError errors={scoreField.state.meta.errors} />
                                      )}
                                    </Field>
                                  )
                                }}
                              </form.Field>
                            </FieldGroup>

                            <div
                              className={cn(
                                "flex flex-col justify-end self-stretch sm:justify-center sm:gap-0",
                                labelIsInvalid ? "gap-y-10" : "gap-y-6"
                              )}
                            >
                              <Toggle
                                variant="outline"
                                pressed={isCorrect}
                                onPressedChange={() => handleToggleCorrect(index)}
                                disabled={liveValue === ""}
                                className={cn(
                                  "sm:hidden",
                                  "rounded-full",
                                  "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
                                  "hover:cursor-pointer"
                                )}
                              >
                                <Check />
                              </Toggle>

                              <FieldLabel />

                              <Button
                                type="button"
                                size="icon"
                                variant="outline"
                                onClick={() => handleDelete(index)}
                                className="rounded-full hover:bg-destructive hover:text-destructive-foreground"
                              >
                                <Trash2 />
                              </Button>
                            </div>
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
                    tempId: crypto.randomUUID(),
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
