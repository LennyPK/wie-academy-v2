"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
import { toast } from "sonner"
import { submitQuizResponse } from "../actions"
import type { Quiz, QuizAnswerPayload, SubmitQuizResult } from "../types"
import QuestionRenderer from "./question-renderer"

type QuizTakeProps = {
  quiz: Quiz
  onCompleteAction: (result: SubmitQuizResult, answers: Record<string, unknown>) => void
}

export default function QuizTake({ quiz, onCompleteAction }: QuizTakeProps) {
  const [answers, setAnswers] = useState<Record<string, unknown>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  // Calculate progress
  const totalQuestions = quiz.questions.length
  const answeredQuestions = Object.keys(answers).filter((questionId) => {
    const value = answers[questionId]
    // Check if answer is not empty
    if (value === null || value === undefined || value === "") return false
    if (Array.isArray(value) && value.length === 0) return false
    return true
  }).length
  const progressPercentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0

  // Check if all required questions are answered
  const validateRequiredQuestions = () => {
    const unansweredRequired = quiz.questions
      .filter((q) => q.isRequired)
      .filter((q) => {
        const value = answers[q.id]
        if (value === null || value === undefined || value === "") return true
        if (Array.isArray(value) && value.length === 0) return true
        return false
      })

    return unansweredRequired
  }

  const handleAnswerChange = (questionId: string, value: unknown) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleSubmitClick = () => {
    const unanswered = validateRequiredQuestions()

    if (unanswered.length > 0) {
      toast.error("Please answer all required questions", {
        description: `${unanswered.length} required ${
          unanswered.length === 1 ? "question" : "questions"
        } not answered`,
      })
      return
    }

    setShowConfirmDialog(true)
  }

  const handleConfirmSubmit = async () => {
    setShowConfirmDialog(false)
    setIsSubmitting(true)

    const toastId = toast.loading("Submitting your quiz...")

    try {
      // Transform answers to QuizAnswerPayload format
      const answerPayloads: QuizAnswerPayload[] = quiz.questions.map((question) => {
        const value = answers[question.id]

        const payload: QuizAnswerPayload = {
          questionId: question.id,
        }

        // Map answer value to appropriate field based on question type
        switch (question.type) {
          case "MULTICHOICE":
            // Value is option index (number)
            payload.valueInt = value as number
            break
          case "CHECKBOX":
            // Value is array of option indexes
            payload.valueJson = value
            break
          case "YES_NO":
            // Value is boolean
            payload.valueBoolean = value as boolean
            break
          case "TEXT":
            // Value is string
            payload.valueString = value as string
            break
          case "RATING":
          case "SCALE":
            // Value is number
            payload.valueInt = value as number
            break
        }

        return payload
      })

      // Submit to server
      const result = await submitQuizResponse(quiz.id, answerPayloads)

      toast.success("Quiz submitted successfully!", {
        id: toastId,
        description: `You scored ${result.score} out of ${result.maxScore} points`,
      })

      // Transition to results view
      onCompleteAction(result, answers)
    } catch (error) {
      console.error("Failed to submit quiz:", error)
      toast.error("Failed to submit quiz", {
        id: toastId,
        description: error instanceof Error ? error.message : "Please try again",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <Card>
        <CardHeader>
          <CardTitle>{quiz.title}</CardTitle>
          {quiz.description && <CardDescription>{quiz.description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Progress: {answeredQuestions} / {totalQuestions} questions answered
              </span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} />
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="space-y-4">
        {quiz.questions.map((question, index) => (
          <Card key={question.id}>
            <CardHeader>
              <div className="flex items-start gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <QuestionRenderer
                    question={question}
                    value={answers[question.id]}
                    onChange={(value) => handleAnswerChange(question.id, value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-4">
        <Button onClick={handleSubmitClick} disabled={isSubmitting} size="lg">
          {isSubmitting ? "Submitting..." : "Submit Quiz"}
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Quiz?</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your quiz? You have answered {answeredQuestions} out
              of {totalQuestions} questions. Once submitted, you cannot change your answers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmSubmit} disabled={isSubmitting}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
