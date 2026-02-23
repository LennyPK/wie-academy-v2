"use client"

import { cn } from "@/lib/utils"
import { Check, Heart, Star, ThumbsUp, X } from "lucide-react"
import { useState } from "react"
import type { QuizQuestion } from "../../types"

type RatingQuestionProps = {
  question: QuizQuestion
  value: unknown
  onChange: (value: unknown) => void
  disabled?: boolean
  showCorrect?: boolean
  userAnswer?: unknown
  isCorrect?: boolean | null
}

export default function RatingQuestion({
  question,
  value,
  onChange,
  disabled = false,
  showCorrect = false,
  // userAnswer,
  isCorrect,
}: RatingQuestionProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)
  const ratingValue = (value as number) || 0
  // const userAnswerRating = userAnswer as number | undefined

  // Get max rating and icon style (default to 5 stars)
  const maxRating = 5 // Can be extended to read from question metadata
  const iconStyle = "star" // Can be extended to read from question metadata

  // Get correct rating from quizConfig
  const correctRating =
    showCorrect && question.quizConfig
      ? (question.quizConfig as { correctRating?: number }).correctRating
      : undefined

  const getIcon = (index: number, filled: boolean) => {
    const className = cn(
      "h-8 w-8 cursor-pointer transition-all",
      filled ? "fill-current" : "fill-none",
      disabled && "cursor-not-allowed opacity-50",
      !disabled && "hover:scale-110"
    )

    const color = filled ? "text-yellow-500" : "text-gray-300"

    switch (iconStyle) {
      case "heart":
        return <Heart className={cn(className, color)} />
      case "thumbs":
        return <ThumbsUp className={cn(className, color)} />
      default:
        return <Star className={cn(className, color)} />
    }
  }

  const handleClick = (rating: number) => {
    if (!disabled) {
      onChange(rating)
    }
  }

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

      <div className="flex items-center gap-2">
        {Array.from({ length: maxRating }, (_, index) => {
          const rating = index + 1
          const displayRating = hoveredRating || ratingValue
          const filled = rating <= displayRating

          return (
            <button
              key={rating}
              type="button"
              onClick={() => handleClick(rating)}
              onMouseEnter={() => !disabled && setHoveredRating(rating)}
              onMouseLeave={() => !disabled && setHoveredRating(null)}
              disabled={disabled}
              className="focus:outline-none"
              aria-label={`Rate ${rating} out of ${maxRating}`}
            >
              {getIcon(rating, filled)}
            </button>
          )
        })}
        {ratingValue > 0 && (
          <span className="ml-2 text-sm text-muted-foreground">
            {ratingValue} / {maxRating}
          </span>
        )}
      </div>

      {showCorrect && correctRating !== undefined && correctRating !== null && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3">
          <p className="text-sm font-medium text-green-900">
            Correct Rating: {correctRating} / {maxRating}
          </p>
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
