"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { Check, X } from "lucide-react"
import type { QuizQuestion } from "../../types"

type MultiChoiceQuestionProps = {
  question: QuizQuestion
  value: unknown
  onChange: (value: unknown) => void
  disabled?: boolean
  showCorrect?: boolean
  userAnswer?: unknown
  isCorrect?: boolean | null
}

export default function MultiChoiceQuestion({
  question,
  value,
  onChange,
  disabled = false,
  showCorrect = false,
  userAnswer,
  isCorrect,
}: MultiChoiceQuestionProps) {
  const selectedIndex = value as number | undefined
  const userAnswerIndex = userAnswer as number | undefined

  // Get correct option indexes from quizConfig
  const correctIndexes =
    showCorrect && question.quizConfig
      ? (question.quizConfig as { correctOptionIndexes?: number[] }).correctOptionIndexes || []
      : []

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2">
        <h3 className="text-lg font-medium">
          {question.questionText}
          {question.isRequired && <span className="ml-1 text-destructive">*</span>}
        </h3>
        {showCorrect && isCorrect !== null && (
          <div
            className={cn(
              "flex items-center gap-1 text-sm font-medium",
              isCorrect ? "text-green-600" : "text-red-600"
            )}
          >
            {isCorrect ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
            <span>{isCorrect ? "Correct" : "Incorrect"}</span>
          </div>
        )}
      </div>

      <RadioGroup
        value={selectedIndex !== undefined ? String(selectedIndex) : undefined}
        onValueChange={(val) => onChange(Number(val))}
        disabled={disabled}
        className="space-y-3"
      >
        {question.options.map((option, index) => {
          const isSelectedByUser = userAnswerIndex === index
          const isCorrectOption = correctIndexes.includes(index)

          return (
            <div
              key={option.id}
              className={cn(
                "flex items-center space-x-2 rounded-lg border p-3 transition-colors",
                showCorrect && isCorrectOption && "border-green-500 bg-green-50",
                showCorrect && isSelectedByUser && !isCorrectOption && "border-red-500 bg-red-50"
              )}
            >
              <RadioGroupItem value={String(index)} id={`option-${option.id}`} />
              <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer font-normal">
                {option.label}
                {showCorrect && isCorrectOption && (
                  <span className="ml-2 text-xs text-green-600">(Correct Answer)</span>
                )}
              </Label>
            </div>
          )
        })}
      </RadioGroup>

      {showCorrect && question.explanation && (
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="mb-1 text-sm font-medium text-blue-900">Explanation:</p>
          <p className="text-sm text-blue-800">{question.explanation}</p>
        </div>
      )}
    </div>
  )
}
