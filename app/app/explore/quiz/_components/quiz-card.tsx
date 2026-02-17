"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ROUTES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { formatRelative } from "date-fns"
import { Clock, FileQuestion, Award } from "lucide-react"
import { useRouter } from "next/navigation"

interface QuizCardProps {
  quiz: {
    id: string
    title: string
    description: string | null
    createdAt: Date
    updatedAt: Date
    _count?: {
      questions: number
    }
  }
  userBestScore?: {
    score: number
    maxScore: number
  } | null
  attemptCount?: number
}

export default function QuizCard({ quiz, userBestScore, attemptCount = 0 }: QuizCardProps) {
  const router = useRouter()

  const handleQuizClick = () => {
    router.push(`${ROUTES.EXPLORE}/quiz/${quiz.id}`)
  }

  const updated = quiz.updatedAt > quiz.createdAt
  const hasAttempted = attemptCount > 0

  return (
    <Card
      className={cn(
        "min-h-62.5 cursor-pointer flex-col border-0 transition-all duration-100",
        "hover:shadow-md focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:outline-none",
        !hasAttempted && ["border-l-4", updated ? "border-l-secondary" : "border-l-primary"],
        hasAttempted && "bg-muted/50"
      )}
      onClick={handleQuizClick}
    >
      <CardHeader>
        <div className="flex flex-col">
          {/* Stats & Date Container */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
            {/* Question count badge */}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="w-fit gap-2">
                <FileQuestion className="h-3 w-3" />
                {quiz._count?.questions || 0} Questions
              </Badge>
              {hasAttempted && (
                <Badge variant="secondary" className="w-fit">
                  {attemptCount} {attemptCount === 1 ? "Attempt" : "Attempts"}
                </Badge>
              )}
            </div>

            {/* Created/Updated Date */}
            <div className="flex flex-wrap items-center gap-x-4 text-sm text-muted-foreground">
              {quiz.createdAt && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="flex items-center">
                    {quiz.updatedAt > quiz.createdAt
                      ? formatRelative(quiz.updatedAt, new Date())
                      : formatRelative(quiz.createdAt, new Date())}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Title and status */}
          <div className="mt-4 flex items-start gap-2 sm:items-center">
            {/* New/Updated Indicator */}
            {!hasAttempted && (
              <div
                className={`mt-[0.6rem] h-2 w-2 shrink-0 cursor-default rounded-full sm:mt-0 ${
                  updated ? "bg-secondary" : "bg-primary"
                }`}
              />
            )}

            {/* Card Title */}
            <CardTitle
              className={cn(
                "line-clamp-2 text-lg font-semibold sm:line-clamp-1 sm:text-xl",
                hasAttempted ? "text-muted-foreground" : "text-primary"
              )}
            >
              {quiz.title}
            </CardTitle>
          </div>

          {/* Best Score */}
          {userBestScore && (
            <div className="mt-2 flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-500" />
              <CardDescription className="font-medium">
                Best Score: {userBestScore.score} / {userBestScore.maxScore} (
                {Math.round((userBestScore.score / userBestScore.maxScore) * 100)}%)
              </CardDescription>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <p
          className={cn(
            "line-clamp-2 text-sm sm:text-base",
            hasAttempted ? "text-muted-foreground" : "text-foreground"
          )}
        >
          {quiz.description || "No description available."}
        </p>
      </CardContent>
    </Card>
  )
}
