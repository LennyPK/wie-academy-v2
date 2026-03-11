"use client"

import { withForm } from "@/components/form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { quizQuestionTypeOptions, surveyQuestionTypeOptions } from "@/lib/constants/question-types"
import { FormQuestionType, FormType } from "@/lib/prisma/enums"
import { cn } from "@/lib/utils"
import { ChevronDownIcon, Plus, Trash2 } from "lucide-react"
import { formOpts } from "."
import { MultiSelectQuestion } from "./question-forms/multi-select"
import { RatingQuestion } from "./question-forms/rating"
import { ScaleQuestion } from "./question-forms/scale"
import { SingleSelectQuestion } from "./question-forms/single-select"
import { TextQuestion } from "./question-forms/text"
import { TrueFalseQuestion } from "./question-forms/true-false"

export const QuestionsField = withForm({
  ...formOpts,
  props: { formType: FormType.QUIZ as FormType },
  render: ({ form, formType }) => {
    const questionTypeOptions =
      formType === FormType.QUIZ ? quizQuestionTypeOptions : surveyQuestionTypeOptions

    return (
      <form.Field name="questions" mode="array">
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

          return (
            <div className="space-y-5">
              {field.state.value.map((question, i) => (
                <Collapsible key={question.id ?? question.tempId} defaultOpen>
                  <Card key={question.id ?? question.tempId}>
                    <CollapsibleTrigger asChild className="cursor-pointer">
                      <CardHeader className="group flex w-full flex-row items-center gap-2">
                        <ChevronDownIcon className="h-4 w-4 shrink-0 transition-transform duration-300 group-data-open:rotate-180" />

                        <form.Subscribe
                          selector={(state) => {
                            const questionPrompt = state.values.questions[i].prompt

                            const hasErrors = Object.entries(state.fieldMeta).some(
                              ([key, meta]) =>
                                key.startsWith(`questions[${i}]`) && meta?.errors.length
                            )

                            return { questionPrompt, hasErrors }
                          }}
                        >
                          {({ questionPrompt, hasErrors }) => (
                            <div
                              className={cn(
                                "flex w-full items-center gap-2 overflow-hidden text-sm sm:text-base",
                                hasErrors ? "text-destructive" : "text-muted-foreground"
                              )}
                            >
                              <span className={cn("shrink-0")}>Q{i + 1}</span>

                              <span className={cn("truncate")}>{questionPrompt || "Untitled"}</span>
                            </div>
                          )}
                        </form.Subscribe>

                        <CardAction>
                          <form.Subscribe selector={(state) => state.values.questions[i].type}>
                            {(questionType) => {
                              const questionTypeOption = questionTypeOptions.find(
                                (option) => option.value === questionType
                              )

                              return (
                                <>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => {
                                      const currentQuestions = form.getFieldValue("questions")

                                      // Instead of calling removeValue + re-indexing separately (which races
                                      // because removeValue is async), we replace the whole array in one
                                      // atomic setFieldValue — filter the deleted question out and re-index order
                                      // in the same pass.
                                      const updatedQuestions = currentQuestions
                                        .filter((_, questionIndex) => questionIndex !== i)
                                        .map((question, newIndex) => ({
                                          ...question,
                                          order: newIndex,
                                        }))

                                      // Replace the entire questions array after reindexing
                                      form.setFieldValue("questions", updatedQuestions)
                                    }}
                                    className="flex-1 group-data-closed:hidden"
                                    disabled={form.getFieldValue("questions").length <= 1}
                                  >
                                    <Trash2 />
                                    <span className="hidden sm:inline">Delete</span>
                                  </Button>

                                  <Badge
                                    variant="secondary"
                                    className="self-center py-1 text-xs group-data-open:hidden sm:px-3 sm:text-sm"
                                  >
                                    {questionTypeOption ? (
                                      <>
                                        <questionTypeOption.icon />
                                        <span className="hidden sm:inline">
                                          {questionTypeOption.label}
                                        </span>
                                      </>
                                    ) : (
                                      questionType
                                    )}
                                  </Badge>
                                </>
                              )
                            }}
                          </form.Subscribe>
                        </CardAction>
                      </CardHeader>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="collapsible-content">
                      <CardContent>
                        <FieldGroup>
                          {/* Question Type */}
                          <form.AppField name={`questions[${i}].type`}>
                            {(subField) => {
                              return (
                                <subField.SelectIconField
                                  label="Question Type"
                                  placeholder="Select Type"
                                  options={questionTypeOptions}
                                  onValueChange={(value) => {
                                    // When switching to an options-based type, seed with
                                    // two empty options if none exist yet.
                                    if (
                                      value === FormQuestionType.SINGLE_SELECT ||
                                      value === FormQuestionType.MULTI_SELECT
                                    ) {
                                      const question = form.getFieldValue(`questions[${i}]`)
                                      if (!("options" in question) || !question.options.length) {
                                        form.setFieldValue(`questions[${i}].options`, [
                                          {
                                            tempId: crypto.randomUUID(),
                                            label: "",
                                            value: "",
                                            isCorrect: false,
                                            order: 0,
                                            score: 0,
                                          },
                                          {
                                            tempId: crypto.randomUUID(),
                                            label: "",
                                            value: "",
                                            isCorrect: false,
                                            order: 1,
                                            score: 0,
                                          },
                                        ])
                                      }
                                    }
                                  }}
                                />
                              )
                            }}
                          </form.AppField>

                          {/* Question Text */}
                          <form.AppField name={`questions[${i}].prompt`}>
                            {(subField) => {
                              return (
                                <subField.TextField
                                  label="Question Prompt"
                                  placeholder="Question Title"
                                  className="text-sm sm:text-base"
                                />
                              )
                            }}
                          </form.AppField>

                          <FieldGroup className="flex flex-col sm:flex-row">
                            <form.Field name={`questions[${i}].isRequired`}>
                              {(subField) => {
                                const isInvalid =
                                  subField.state.meta.isTouched && !subField.state.meta.isValid

                                return (
                                  <Field
                                    orientation="horizontal"
                                    data-invalid={isInvalid}
                                    className="has-[>[data-slot=field-content]]:items-center"
                                  >
                                    <FieldContent>
                                      <FieldLabel>Required?</FieldLabel>
                                      <FieldDescription>
                                        Will this question be marked?
                                      </FieldDescription>
                                    </FieldContent>

                                    <Switch
                                      id={subField.name}
                                      name={subField.name}
                                      checked={subField.state.value}
                                      onCheckedChange={(checked) =>
                                        subField.handleChange(checked === true)
                                      }
                                      aria-invalid={isInvalid}
                                      disabled
                                    />
                                  </Field>
                                )
                              }}
                            </form.Field>

                            <form.AppField name={`questions[${i}].score`}>
                              {(subField) => {
                                return (
                                  <subField.TextField
                                    type="number"
                                    min={0}
                                    label="Score"
                                    placeholder="10"
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value)
                                      subField.handleChange(val)
                                    }}
                                  />
                                )
                              }}
                            </form.AppField>
                          </FieldGroup>

                          {/* Logic for different question types */}
                          <form.Subscribe selector={(state) => state.values.questions[i].type}>
                            {(questionType) => {
                              switch (questionType) {
                                case FormQuestionType.TEXT:
                                  return <TextQuestion form={form} />
                                case FormQuestionType.SINGLE_SELECT:
                                  return <SingleSelectQuestion form={form} questionIndex={i} />
                                case FormQuestionType.MULTI_SELECT:
                                  return <MultiSelectQuestion form={form} questionIndex={i} />
                                case FormQuestionType.TRUE_FALSE:
                                  return <TrueFalseQuestion form={form} questionIndex={i} />
                                case FormQuestionType.RATING:
                                  return <RatingQuestion form={form} questionIndex={i} />
                                case FormQuestionType.SCALE:
                                  return <ScaleQuestion form={form} questionIndex={i} />
                                default:
                                  return <div>TODO: {questionType}</div>
                              }
                            }}
                          </form.Subscribe>
                        </FieldGroup>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}

              {/* Add Question Button */}
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-xl py-6 text-muted-foreground transition-all",
                  "border-2 border-dashed border-muted-foreground",
                  "hover:border-primary hover:bg-secondary hover:text-primary"
                )}
                onClick={() =>
                  field.pushValue({
                    tempId: crypto.randomUUID(),
                    prompt: "",
                    type: FormQuestionType.SINGLE_SELECT,
                    isRequired: true,
                    order: field.state.value.length,
                    score: 1,
                    options: [
                      {
                        tempId: crypto.randomUUID(),
                        label: "",
                        value: "",
                        isCorrect: false,
                        order: 0,
                        score: 0,
                      },
                      {
                        tempId: crypto.randomUUID(),
                        label: "",
                        value: "",
                        isCorrect: false,
                        order: 1,
                        score: 0,
                      },
                    ],
                  })
                }
              >
                <Plus className="h-5 w-5" />
                Add Question
              </Button>

              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </div>
          )
        }}
      </form.Field>
    )
  },
})
