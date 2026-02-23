"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FormQuestionType } from "@/lib/prisma/enums"
import { CheckSquare, ListChecks, Sliders, Star, ToggleLeft, Type, X } from "lucide-react"
import OptionsArrayField from "./options-array-field"
import RatingQuestionConfig from "./rating-question-config"
import ScaleQuestionConfig from "./scale-question-config"
import TextQuestionConfig from "./text-question-config"
import type { Question } from "./types"
import YesNoQuestionConfig from "./yes-no-question-config"

type QuestionCardProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
  questionIndex: number
  question: Question
  onRemove: () => void
  canRemove: boolean
}

const questionTypeConfig: Record<
  FormQuestionType,
  { label: string; icon: React.ReactNode; description: string }
> = {
  MULTICHOICE: {
    label: "Multiple Choice",
    icon: <ListChecks className="h-4 w-4" />,
    description: "Single selection from options",
  },
  CHECKBOX: {
    label: "Checkbox",
    icon: <CheckSquare className="h-4 w-4" />,
    description: "Multiple selections allowed",
  },
  YES_NO: {
    label: "Yes/No",
    icon: <ToggleLeft className="h-4 w-4" />,
    description: "Simple yes or no answer",
  },
  TEXT: {
    label: "Text",
    icon: <Type className="h-4 w-4" />,
    description: "Free text response",
  },
  RATING: {
    label: "Rating",
    icon: <Star className="h-4 w-4" />,
    description: "Star or numeric rating",
  },
  SCALE: {
    label: "Scale",
    icon: <Sliders className="h-4 w-4" />,
    description: "Numeric scale with range",
  },
}

export default function QuestionCard({
  form,
  questionIndex,
  question,
  onRemove,
  canRemove,
}: QuestionCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Q{questionIndex + 1}</span>
          </div>
          <Badge>{questionTypeConfig[question.type]?.label || "Unknown"}</Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-y-6">
        {/* Question Text */}
        <form.Field name={`questions[${questionIndex}].questionText`}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(subField: any) => {
            const isInvalid = subField.state.meta.isTouched && !subField.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={subField.name}>Question Text</FieldLabel>
                <Input
                  id={subField.name}
                  name={subField.name}
                  type="text"
                  placeholder="Enter your question"
                  value={subField.state.value}
                  onBlur={subField.handleBlur}
                  onChange={(e) => subField.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={subField.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        {/* Question Type */}
        <form.Field name={`questions[${questionIndex}].type`}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(typeField: any) => {
            const isInvalid = typeField.state.meta.isTouched && !typeField.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={typeField.name}>Question Type</FieldLabel>
                <Select
                  name={typeField.name}
                  value={typeField.state.value}
                  onValueChange={(value) => typeField.handleChange(value as FormQuestionType)}
                >
                  <SelectTrigger id={typeField.name} aria-invalid={isInvalid}>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(questionTypeConfig).map(([type, config]) => (
                      <SelectItem key={type} value={type}>
                        <div className="flex items-center gap-2">
                          {config.icon}
                          <span>{config.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isInvalid && <FieldError errors={typeField.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        {/* Type-Specific Fields */}
        <form.Field name={`questions[${questionIndex}].type`}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(typeField: any) => {
            const questionType = typeField.state.value

            return (
              <>
                {(questionType === "MULTICHOICE" || questionType === "CHECKBOX") && (
                  <form.Field name={`questions[${questionIndex}].options`} mode="array">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(optionsField: any) => (
                      <OptionsArrayField
                        questionIndex={questionIndex}
                        optionsField={optionsField}
                        form={form}
                      />
                    )}
                  </form.Field>
                )}

                {questionType === "YES_NO" && (
                  <YesNoQuestionConfig questionIndex={questionIndex} form={form} />
                )}

                {questionType === "TEXT" && (
                  <TextQuestionConfig questionIndex={questionIndex} form={form} />
                )}

                {questionType === "RATING" && (
                  <RatingQuestionConfig questionIndex={questionIndex} form={form} />
                )}

                {questionType === "SCALE" && (
                  <ScaleQuestionConfig questionIndex={questionIndex} form={form} />
                )}
              </>
            )
          }}
        </form.Field>

        {/* Explanation Field */}
        <form.Field name={`questions[${questionIndex}].explanation`}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(subField: any) => {
            const isInvalid = subField.state.meta.isTouched && !subField.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={subField.name}>Explanation (Optional)</FieldLabel>
                <Input
                  id={subField.name}
                  name={subField.name}
                  type="text"
                  placeholder="Explain the correct answer"
                  value={subField.state.value || ""}
                  onBlur={subField.handleBlur}
                  onChange={(e) => subField.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={subField.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        {/* Score Field */}
        <form.Field name={`questions[${questionIndex}].score`}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(subField: any) => {
            const isInvalid = subField.state.meta.isTouched && !subField.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={subField.name}>Score (Points)</FieldLabel>
                <Input
                  id={subField.name}
                  name={subField.name}
                  type="number"
                  min="1"
                  placeholder="1"
                  value={subField.state.value || 1}
                  onBlur={subField.handleBlur}
                  onChange={(e) => subField.handleChange(Number(e.target.value))}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={subField.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        {/* Remove Question Button */}
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onRemove}
          disabled={!canRemove}
          className="w-full"
        >
          <X className="mr-2 h-4 w-4" />
          Remove Question
        </Button>
      </CardContent>
    </Card>
  )
}
