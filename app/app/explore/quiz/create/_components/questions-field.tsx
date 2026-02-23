import { withForm } from "@/components/form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { questionTypeOptions } from "@/lib/constants/question-types"
import { FormQuestionType } from "@/lib/prisma/enums"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"
import { formOpts } from "."
import { MultiSelectQuestion } from "./question.multi-select"
import { RatingQuestion2 } from "./question.rating"
import { ScaleQuestion } from "./question.scale"
import { SingleSelectQuestion } from "./question.single-select"
import { TextQuestion } from "./question.text"
import { TrueFalseQuestion } from "./question.true-false"

export const QuestionsField = withForm({
  ...formOpts,
  render: ({ form }) => {
    return (
      <form.Field name="questions" mode="array">
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

          return (
            <div className="space-y-5">
              {field.state.value.map((question, i) => (
                <Card key={question.id}>
                  <CardHeader>
                    <form.Subscribe
                      selector={(state) => {
                        const questionPrompt = state.values.questions[i].prompt
                        const questionType = state.values.questions[i].type

                        return { questionPrompt, questionType }
                      }}
                    >
                      {({ questionPrompt, questionType }) => (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Q{i + 1}</span>
                            {questionPrompt ? (
                              <span>{questionPrompt}</span>
                            ) : (
                              <span className="text-muted-foreground">Untitled</span>
                            )}
                          </div>

                          <Badge>{questionType}</Badge>
                        </div>
                      )}
                    </form.Subscribe>
                  </CardHeader>

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
                            />
                          )
                        }}
                      </form.AppField>

                      <FieldGroup className="flex flex-row">
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
                                  <FieldDescription>Will this question be marked?</FieldDescription>
                                </FieldContent>

                                <Switch
                                  id={subField.name}
                                  name={subField.name}
                                  checked={subField.state.value}
                                  onCheckedChange={(checked) =>
                                    subField.handleChange(checked === true)
                                  }
                                  aria-invalid={isInvalid}
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
                              return <RatingQuestion2 form={form} questionIndex={i} />
                            case FormQuestionType.SCALE:
                              return <ScaleQuestion form={form} questionIndex={i} />
                            default:
                              return <div>TODO: {questionType}</div>
                          }
                        }}
                      </form.Subscribe>
                    </FieldGroup>
                  </CardContent>
                </Card>
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
                    id: crypto.randomUUID(),
                    prompt: "",
                    type: FormQuestionType.SINGLE_SELECT,
                    isRequired: true,
                    order: field.state.value.length,
                    score: 1,
                    options: [
                      {
                        id: crypto.randomUUID(),
                        label: "",
                        value: "",
                        isCorrect: false,
                        order: 0,
                        score: 0,
                      },
                      {
                        id: crypto.randomUUID(),
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
