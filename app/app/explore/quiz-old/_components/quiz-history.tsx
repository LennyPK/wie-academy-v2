"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, RotateCcw, Calendar, Award } from "lucide-react"
import { format } from "date-fns"
import type { Quiz, QuizResponse } from "../types"

type QuizHistoryProps = {
  quiz: Quiz
  responses: QuizResponse[]
  onViewAttempt: (responseId: string) => void
  onRetake: () => void
}

export default function QuizHistory({
  quiz,
  responses,
  onViewAttempt,
  onRetake,
}: QuizHistoryProps) {
  // Calculate max possible score from quiz questions
  const maxScore = quiz.questions.reduce((sum, q) => sum + (q.score ?? 1), 0)

  // Sort responses by submission date (most recent first)
  const sortedResponses = [...responses].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  )

  const getScoreBadgeVariant = (score: number, max: number) => {
    const percentage = max > 0 ? (score / max) * 100 : 0
    if (percentage >= 80) return "default" // Green
    if (percentage >= 60) return "secondary" // Yellow
    return "destructive" // Red
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Quiz Attempt History</CardTitle>
              <CardDescription>
                You have completed this quiz {responses.length}{" "}
                {responses.length === 1 ? "time" : "times"}
              </CardDescription>
            </div>
            <Button onClick={onRetake} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Take Again
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Attempts List */}
      {sortedResponses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No attempts yet. Take the quiz to see your results here!
            </p>
            <Button onClick={onRetake} className="mt-4 gap-2">
              <RotateCcw className="h-4 w-4" />
              Take Quiz
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sortedResponses.map((response, index) => {
            const attemptNumber = sortedResponses.length - index
            const percentage = maxScore > 0 ? (response.total / maxScore) * 100 : 0

            return (
              <Card key={response.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-1 items-center gap-4">
                      <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold text-primary">#{attemptNumber}</span>
                        {index === 0 && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            Latest
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">
                            {format(new Date(response.submittedAt), "MMM d, yyyy")}
                          </span>
                          <span>at {format(new Date(response.submittedAt), "h:mm a")}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-muted-foreground" />
                            <Badge variant={getScoreBadgeVariant(response.total, maxScore)}>
                              {response.total} / {maxScore}
                            </Badge>
                          </div>
                          <span className="text-sm font-medium">{Math.round(percentage)}%</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewAttempt(response.id)}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Best Score Summary */}
      {sortedResponses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Best Score</p>
                <p className="text-2xl font-bold">
                  {Math.max(...sortedResponses.map((r) => r.total))} / {maxScore}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold">
                  {Math.round(
                    sortedResponses.reduce((sum, r) => sum + r.total, 0) / sortedResponses.length
                  )}{" "}
                  / {maxScore}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Attempts</p>
                <p className="text-2xl font-bold">{sortedResponses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
