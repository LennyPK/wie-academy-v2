"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, RotateCcw, History, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Quiz, SubmitQuizResult } from "../types"
import QuestionRenderer from "./question-renderer"

type QuizResultsProps = {
  quiz: Quiz
  result: SubmitQuizResult
  userAnswers: Record<string, unknown>
  onRetake: () => void
  onViewHistory: () => void
}

export default function QuizResults({
  quiz,
  result,
  userAnswers,
  onRetake,
  onViewHistory,
}: QuizResultsProps) {
  const percentage = result.maxScore > 0 ? (result.score / result.maxScore) * 100 : 0

  // Determine success message based on percentage
  const getSuccessMessage = () => {
    if (percentage >= 90) return "Excellent work! 🎉"
    if (percentage >= 80) return "Great job! 👏"
    if (percentage >= 70) return "Good effort! 👍"
    if (percentage >= 60) return "Not bad! Keep practicing."
    return "Keep trying! You'll do better next time."
  }

  // Get background color based on score
  const getScoreColor = () => {
    if (percentage >= 80) return "bg-green-50 border-green-200"
    if (percentage >= 60) return "bg-yellow-50 border-yellow-200"
    return "bg-red-50 border-red-200"
  }

  const getScoreTextColor = () => {
    if (percentage >= 80) return "text-green-900"
    if (percentage >= 60) return "text-yellow-900"
    return "text-red-900"
  }

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <Card className={cn("border-2", getScoreColor())}>
        <CardHeader>
          <CardTitle className={cn("text-2xl", getScoreTextColor())}>
            {getSuccessMessage()}
          </CardTitle>
          <CardDescription className={getScoreTextColor()}>
            You scored {result.score} out of {result.maxScore} points ({Math.round(percentage)}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={onRetake} variant="default" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Retake Quiz
            </Button>
            <Button onClick={onViewHistory} variant="outline" className="gap-2">
              <History className="h-4 w-4" />
              View Previous Attempts
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Question Results */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Question-by-Question Results</h2>

        {quiz.questions.map((question, index) => {
          const questionResult = result.results.find((r) => r.questionId === question.id)
          const userAnswer = userAnswers[question.id]
          const isCorrect = questionResult?.isCorrect
          const pointsEarned = questionResult?.score ?? 0
          const maxPoints = question.score ?? 1

          return (
            <Card
              key={question.id}
              className={cn(
                "border-l-4",
                isCorrect === true && "border-l-green-500 bg-green-50/50",
                isCorrect === false && "border-l-red-500 bg-red-50/50",
                isCorrect === null && "border-l-gray-300"
              )}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-1 items-start gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <QuestionRenderer
                        question={question}
                        value={userAnswer}
                        onChange={() => {}}
                        disabled={true}
                        showCorrect={true}
                        userAnswer={userAnswer}
                        isCorrect={isCorrect}
                      />
                    </div>
                  </div>

                  {/* Score Indicator */}
                  <div className="flex min-w-24 flex-col items-end gap-1">
                    {isCorrect !== null && (
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
                    <div className="text-sm text-muted-foreground">
                      {pointsEarned} / {maxPoints} {maxPoints === 1 ? "point" : "points"}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      {/* Actions Footer */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Want to improve your score? You can retake this quiz as many times as you want.
            </p>
            <Button onClick={onRetake} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Retake Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
