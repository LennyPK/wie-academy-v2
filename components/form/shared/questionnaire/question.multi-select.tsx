import { withFieldGroup } from "@/components/form"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Toggle } from "@/components/ui/toggle"
import { QuestionnaireQuestionType } from "@/lib/prisma/enums"
import { cn, slugify } from "@/lib/utils"
import { Check, Plus, Trash2 } from "lucide-react"
import * as z from "zod"

const optionSchema = z.object({
  id: z.string().optional(),
  tempId: z.string(),
  label: z.string().trim().min(1, "Option label is required").max(200, "Option label is too long"),
  value: z.string(),
  isCorrect: z.boolean(),
  score: z.int().nonnegative(),
  order: z.int().nonnegative(),
})

export const multiSelectQuestionSchema = z
  .object({
    id: z.string().optional(),
    tempId: z.string(),
    prompt: z
      .string()
      .trim()
      .min(1, "Question prompt is required")
      .max(500, "Question prompt is too long"),
    // explanation: z.string().trim().max(1000, "Explanation is too long").optional(),
    score: z.int("Score is required").min(1, "A question must be worth at least 1 point"),
    isRequired: z.boolean(),
    order: z.int().nonnegative(),

    type: z.literal(QuestionnaireQuestionType.MULTI_SELECT),
    options: z.array(optionSchema).min(2, "At least 2 options are required"),
  })
  .superRefine((data, ctx) => {
    const correctCount = data.options.filter((option) => option.isCorrect).length
    if (correctCount < 1) {
      ctx.addIssue({
        code: "custom",
        message: "At least one option must be marked as correct",
        path: ["options"],
      })
    }

    const totalOptionScore = data.options
      .filter((option) => option.isCorrect)
      .reduce((sum, option) => sum + option.score, 0)

    if (totalOptionScore !== data.score) {
      ctx.addIssue({
        code: "custom",
        message: `Scores awarded across correct options (${totalOptionScore}) must add up to the question's total score (${data.score})`,
        path: ["options"],
      })
    }
  })

const initialValues: z.infer<typeof multiSelectQuestionSchema> = {
  tempId: crypto.randomUUID(),
  prompt: "",
  score: 0,
  isRequired: true,
  order: 0,
  type: QuestionnaireQuestionType.MULTI_SELECT,
  options: [
    { tempId: crypto.randomUUID(), label: "", value: "", isCorrect: false, order: 0, score: 0 },
    { tempId: crypto.randomUUID(), label: "", value: "", isCorrect: false, order: 1, score: 0 },
  ],
}

export const SingleSelectQuestion = withFieldGroup({
  defaultValues: initialValues,
  props: { questionIndex: 0 },
  render: function Render({ group, questionIndex }) {
    return (
      <group.Field name={"options"} mode="array">
        {(optionsField) => {
          // Guard against the question not having options yet —
          // this happens when switching from a non-options type like TEXT.
          if (!optionsField.state.value) return null

          const optionsIsInvalid =
            optionsField.state.meta.isTouched && !optionsField.state.meta.isValid

          const getOptions = () => {
            return group.getFieldValue("options")
          }

          // Unlike single-select, toggling correct on one option is independent —
          // we just flip the one option rather than setting all atomically.
          const handleToggleCorrect = (index: number) => {
            const options = getOptions()
            const isCurrentlyCorrect = options[index].isCorrect

            group.setFieldValue(`options[${index}].isCorrect`, !options[index].isCorrect)

            // Reset score to 0 when unmarking as correct so it doesn't
            // silently count toward the superRefine score sum check.
            if (isCurrentlyCorrect) {
              group.setFieldValue(`options[${index}].score`, 0)
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
            group.setFieldValue("options", updatedOptions)
          }

          return (
            <FieldGroup>
              {optionsField.state.value.map((option, index) => (
                <group.Field
                  // Use a stable option.id (set once on creation via crypto.randomUUID())
                  // rather than index or option.value so React doesn't unmount/remount
                  // the field on delete or on every keystroke as the slug changes.
                  key={`${questionIndex}-option-${option.id ?? option.tempId}`}
                  name={`options[${index}].label`}
                >
                  {(labelField) => {
                    const labelIsInvalid =
                      labelField.state.meta.isTouched && !labelField.state.meta.isValid

                    return (
                      // Per-option subscribe consolidates liveValue, isDuplicate,
                      // isCorrect, and order into one selector so we only have a
                      // single subscription per row rather than multiple nested ones.
                      <group.Subscribe
                        selector={(state) => {
                          const question = state.values
                          if (
                            !question ||
                            question.type !== QuestionnaireQuestionType.MULTI_SELECT
                          ) {
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
                          <FieldGroup className="flex flex-row items-end">
                            <span className="font-medium">{order}.</span>

                            <Toggle
                              variant="outline"
                              pressed={isCorrect}
                              onPressedChange={() => handleToggleCorrect(index)}
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
                              <FieldLabel htmlFor={labelField.name}>Option Label</FieldLabel>
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
                                  group.setFieldValue(`options[${index}].value`, newSlug)

                                  // No need to re-sync isCorrect on label change for
                                  // multi-select — isCorrect is independent of value,
                                  // unlike single-select where the Toggle matches by value slug
                                  // and must stay in sync when the label changes.
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

                            <group.Field name={`options[${index}].score`}>
                              {(scoreField) => {
                                const scoreIsInvalid =
                                  scoreField.state.meta.isTouched && !scoreField.state.meta.isValid
                                return (
                                  <Field data-invalid={scoreIsInvalid} className="w-30 shrink-0">
                                    <FieldLabel htmlFor={scoreField.name}>Option Score</FieldLabel>
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
                                      aria-invalid={scoreIsInvalid}
                                      disabled={!isCorrect}
                                    />
                                    {scoreIsInvalid && (
                                      <FieldError errors={scoreField.state.meta.errors} />
                                    )}
                                  </Field>
                                )
                              }}
                            </group.Field>

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
                      </group.Subscribe>
                    )
                  }}
                </group.Field>
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
      </group.Field>
    )
  },
})
