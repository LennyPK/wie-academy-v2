"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { QuizScoreData, QuizWithQuestions } from "@/explore/quiz/types"
import { BarChart3, HelpCircle, Trophy } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

interface QuizDetailProps {
  quiz: QuizWithQuestions
  scoreData: QuizScoreData
}

export default function QuizDetail({ quiz, scoreData }: QuizDetailProps) {
  const router = useRouter()
  const pathname = usePathname()

  const totalQuestions = quiz.questions.length
  const maxScore = quiz.questions.reduce((sum, question) => sum + (question.score ?? 0), 0)
  const bestScore = ((scoreData.bestScore ?? 0) / maxScore) * 100
  const attemptCount = scoreData.attemptCount

  return (
    <Card>
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
        <CardDescription>{quiz.description}</CardDescription>
      </CardHeader>

      <CardContent>
        {/* Info grid */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-muted p-3 text-center">
            <HelpCircle className="mx-auto mb-1 h-5 w-5 text-primary" />
            <p className="text-lg font-semibold">{totalQuestions}</p>
            <p className="text-xs text-muted-foreground">Questions</p>
          </div>
          <div className="rounded-lg bg-muted p-3 text-center">
            <BarChart3 className="mx-auto mb-1 h-5 w-5 text-primary" />
            <p className="text-lg font-semibold">{maxScore}</p>
            <p className="text-xs text-muted-foreground">Total Points</p>
          </div>
          <div className="rounded-lg bg-muted p-3 text-center">
            <Trophy className="mx-auto mb-1 h-5 w-5 text-amber-500" />
            <p className="text-lg font-semibold">
              {bestScore !== 0 ? `${bestScore.toFixed(0)}%` : "--"}
            </p>
            <p className="text-xs text-muted-foreground">Best Score</p>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={() => {
            router.push(`${pathname}/attempt`)
          }}
          className="w-full"
        >
          {attemptCount > 0 ? "Retake" : "Take"} Quiz
        </Button>
      </CardFooter>
    </Card>
  )
}
