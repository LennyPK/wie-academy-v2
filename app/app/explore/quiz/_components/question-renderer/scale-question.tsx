"use client"

import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { Check, X } from "lucide-react"
import type { QuizQuestion } from "../../types"

type ScaleQuestionProps = {
  question: QuizQuestion
  value: unknown
  onChange: (value: unknown) => void
  disabled?: boolean
  showCorrect?: boolean
  userAnswer?: unknown
  isCorrect?: boolean | null
}

export default function ScaleQuestion({
  question,
  value,
  onChange,
  disabled = false,
  showCorrect = false,
  // userAnswer,
  isCorrect,
}: ScaleQuestionProps) {
  const scaleValue = (value as number) || 0
  // const userAnswerValue = userAnswer as number | undefined

  // Default scale values (can be extended to read from question metadata)
  const minValue = 0
  const maxValue = 10
  const step = 1
  const minLabel = "Not at all"
  const maxLabel = "Very much"

  // Get correct value from quizConfig
  const correctValue =
    showCorrect && question.quizConfig
      ? (question.quizConfig as { correctValue?: number }).correctValue
      : undefined

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

      <div className="space-y-4">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>

        <Slider
          value={[scaleValue]}
          onValueChange={(values) => onChange(values[0])}
          min={minValue}
          max={maxValue}
          step={step}
          disabled={disabled}
          className="w-full"
        />

        <div className="flex justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold">{scaleValue}</p>
            <p className="text-xs text-muted-foreground">
              Current value ({minValue}-{maxValue})
            </p>
          </div>
        </div>
      </div>

      {showCorrect && correctValue !== undefined && correctValue !== null && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3">
          <p className="text-sm font-medium text-green-900">Correct Value: {correctValue}</p>
        </div>
      )}

      {showCorrect && question.explanation && (
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="mb-1 text-sm font-medium text-blue-900">Explanation:</p>
          <p className="text-sm text-blue-800">{question.explanation}</p>
        </div>
      )}
    </div>
  )
}
