"use client"

import { useState } from "react"
import type { Quiz, QuizResponse, SubmitQuizResult } from "../types"
import QuizHistory from "./quiz-history"
import QuizResults from "./quiz-results"
import QuizTake from "./quiz-take"

type ViewMode = "take" | "results" | "history" | "viewAttempt"

type QuizDetailProps = {
  quiz: Quiz
  responses: QuizResponse[]
  userId: string
}

export default function QuizDetail({
  quiz,
  responses,
  // userId
}: QuizDetailProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(responses.length > 0 ? "history" : "take")
  const [currentResult, setCurrentResult] = useState<SubmitQuizResult | null>(null)
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, unknown>>({})
  const [viewingResponseId, setViewingResponseId] = useState<string | null>(null)

  const handleQuizComplete = (result: SubmitQuizResult, answers: Record<string, unknown>) => {
    setCurrentResult(result)
    setCurrentAnswers(answers)
    setViewMode("results")
  }

  const handleRetake = () => {
    setCurrentResult(null)
    setCurrentAnswers({})
    setViewMode("take")
  }

  const handleViewHistory = () => {
    setViewMode("history")
  }

  const handleViewAttempt = (responseId: string) => {
    setViewingResponseId(responseId)
    setViewMode("viewAttempt")
  }

  const handleBackToHistory = () => {
    setViewingResponseId(null)
    setViewMode("history")
  }

  // Render based on view mode
  if (viewMode === "take") {
    return <QuizTake quiz={quiz} onCompleteAction={handleQuizComplete} />
  }

  if (viewMode === "results" && currentResult) {
    return (
      <QuizResults
        quiz={quiz}
        result={currentResult}
        userAnswers={currentAnswers}
        onRetake={handleRetake}
        onViewHistory={handleViewHistory}
      />
    )
  }

  if (viewMode === "viewAttempt" && viewingResponseId) {
    // Find the response being viewed
    const response = responses.find((r) => r.id === viewingResponseId)

    if (!response) {
      return <div>Response not found</div>
    }

    // Calculate max score
    const maxScore = quiz.questions.reduce((sum, q) => sum + (q.score ?? 1), 0)

    // Reconstruct the result and answers from the saved response
    const reconstructedResult: SubmitQuizResult = {
      responseId: response.id,
      score: response.total,
      maxScore: maxScore,
      results: quiz.questions.map((question) => {
        const answer = response.answers.find((a) => a.questionId === question.id)
        return {
          questionId: question.id,
          isCorrect: answer?.isCorrect ?? null,
          score: answer?.score ?? null,
          explanation: question.explanation,
        }
      }),
    }

    // Reconstruct user answers from saved FormAnswer records
    const reconstructedAnswers = quiz.questions.reduce(
      (acc, question) => {
        const answer = response.answers.find((a) => a.questionId === question.id)
        if (!answer) return acc

        // Map back from database fields to original answer format
        let answerValue: unknown = null

        switch (question.type) {
          case "MULTICHOICE":
          case "RATING":
          case "SCALE":
            answerValue = answer.valueInt
            break
          case "YES_NO":
            answerValue = answer.valueBoolean
            break
          case "TEXT":
            answerValue = answer.valueString
            break
          case "CHECKBOX":
            answerValue = answer.valueJson
            break
        }

        acc[question.id] = answerValue
        return acc
      },
      {} as Record<string, unknown>
    )

    return (
      <div className="space-y-4">
        <button
          onClick={handleBackToHistory}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to History
        </button>
        <QuizResults
          quiz={quiz}
          result={reconstructedResult}
          userAnswers={reconstructedAnswers}
          onRetake={handleRetake}
          onViewHistory={handleBackToHistory}
        />
      </div>
    )
  }

  // Default to history view
  return (
    <QuizHistory
      quiz={quiz}
      responses={responses}
      onViewAttempt={handleViewAttempt}
      onRetake={handleRetake}
    />
  )
}
