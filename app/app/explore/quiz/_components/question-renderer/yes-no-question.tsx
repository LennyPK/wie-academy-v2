"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Check, X } from "lucide-react"
import type { QuizQuestion } from "../../types"

type YesNoQuestionProps = {
  question: QuizQuestion
  value: unknown
  onChange: (value: unknown) => void
  disabled?: boolean
  showCorrect?: boolean
  userAnswer?: unknown
  isCorrect?: boolean | null
}

export default function YesNoQuestion({
  question,
  value,
  onChange,
  disabled = false,
  showCorrect = false,
  userAnswer,
  isCorrect,
}: YesNoQuestionProps) {
  const selectedValue = value as boolean | undefined
  const userAnswerValue = userAnswer as boolean | undefined

  // Get correct answer from quizConfig
  const correctAnswer =
    showCorrect && question.quizConfig
      ? (question.quizConfig as { correctAnswer?: boolean }).correctAnswer
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

      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant={selectedValue === true ? "default" : "outline"}
          size="lg"
          onClick={() => !disabled && onChange(true)}
          disabled={disabled}
          className={cn(
            "h-20 text-lg",
            showCorrect &&
              correctAnswer === true &&
              "border-green-500 bg-green-50 hover:bg-green-100",
            showCorrect &&
              userAnswerValue === true &&
              correctAnswer !== true &&
              "border-red-500 bg-red-50 hover:bg-red-100"
          )}
        >
          <div className="flex flex-col items-center gap-2">
            <span>Yes</span>
            {showCorrect && correctAnswer === true && (
              <span className="text-xs text-green-600">(Correct)</span>
            )}
          </div>
        </Button>

        <Button
          type="button"
          variant={selectedValue === false ? "default" : "outline"}
          size="lg"
          onClick={() => !disabled && onChange(false)}
          disabled={disabled}
          className={cn(
            "h-20 text-lg",
            showCorrect &&
              correctAnswer === false &&
              "border-green-500 bg-green-50 hover:bg-green-100",
            showCorrect &&
              userAnswerValue === false &&
              correctAnswer !== false &&
              "border-red-500 bg-red-50 hover:bg-red-100"
          )}
        >
          <div className="flex flex-col items-center gap-2">
            <span>No</span>
            {showCorrect && correctAnswer === false && (
              <span className="text-xs text-green-600">(Correct)</span>
            )}
          </div>
        </Button>
      </div>

      {showCorrect && question.explanation && (
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="mb-1 text-sm font-medium text-blue-900">Explanation:</p>
          <p className="text-sm text-blue-800">{question.explanation}</p>
        </div>
      )}
    </div>
  )
}
