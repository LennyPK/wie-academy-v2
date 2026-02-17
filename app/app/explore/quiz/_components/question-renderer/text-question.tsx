"use client"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Check, X } from "lucide-react"
import type { QuizQuestion } from "../../types"

type TextQuestionProps = {
  question: QuizQuestion
  value: unknown
  onChange: (value: unknown) => void
  disabled?: boolean
  showCorrect?: boolean
  userAnswer?: unknown
  isCorrect?: boolean | null
}

export default function TextQuestion({
  question,
  value,
  onChange,
  disabled = false,
  showCorrect = false,
  userAnswer,
  isCorrect,
}: TextQuestionProps) {
  const textValue = (value as string) || ""
  const userAnswerText = userAnswer as string | undefined

  // Get acceptable answers from quizConfig
  const acceptableAnswers =
    showCorrect && question.quizConfig
      ? (question.quizConfig as { acceptableAnswers?: string[] }).acceptableAnswers || []
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

      <Input
        type="text"
        value={textValue}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={disabled ? userAnswerText || "No answer provided" : "Enter your answer"}
        className={cn(
          showCorrect && isCorrect === true && "border-green-500",
          showCorrect && isCorrect === false && "border-red-500"
        )}
      />

      {showCorrect && acceptableAnswers.length > 0 && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3">
          <p className="mb-1 text-sm font-medium text-green-900">Acceptable Answers:</p>
          <ul className="list-inside list-disc text-sm text-green-800">
            {acceptableAnswers.map((answer, index) => (
              <li key={index}>{answer}</li>
            ))}
          </ul>
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
