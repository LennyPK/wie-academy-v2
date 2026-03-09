"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Progress } from "@/components/ui/progress"
import { QuizScoreData, QuizWithQuestions } from "@/explore/quiz/types"
import { ROUTES } from "@/lib/constants"
import { ArrowRight, BarChart3, CircleQuestionMark } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

interface QuizCardProps {
  userId: string
  userRole: string
  quiz: QuizWithQuestions
  scoreData: QuizScoreData
}

export default function QuizCard({ userId, userRole, quiz, scoreData }: QuizCardProps) {
  const router = useRouter()
  const pathname = usePathname()

  const maxScore = quiz.questions.reduce((sum, question) => sum + (question.score ?? 0), 0)

  const handleQuizClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`${ROUTES.QUIZ}/${quiz.id}`)
  }
  const handleTakeQuizClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`${ROUTES.QUIZ}/${quiz.id}/attempt`)
  }

  console.log(`${userId}: ${userRole}, ${pathname}`)
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild className="cursor-pointer">
        <Card key={quiz.id} onClick={handleQuizClick}>
          <CardHeader>
            <CardTitle className="line-clamp-1">{quiz.title}</CardTitle>
            <CardDescription className="line-clamp-2">{quiz.description}</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:grid sm:grid-cols-2 sm:gap-0">
              <div className="flex items-center gap-2">
                <CircleQuestionMark className="h-5 w-5" />
                <span>
                  {quiz.questions.length || 0} Question{quiz.questions.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                <span>{maxScore} points</span>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            {scoreData ? (
              <div className="flex w-full flex-col gap-2">
                <div className="flex w-full justify-between text-xs text-muted-foreground">
                  <div>
                    <span>
                      Best Score: {scoreData.bestScore ?? 0} / {maxScore}
                    </span>
                  </div>
                  <Badge variant="outline">
                    {scoreData.attemptCount} attempt{scoreData.attemptCount !== 1 ? "s" : ""}
                  </Badge>
                </div>
                <Progress value={((scoreData.bestScore ?? 0) / maxScore) * 100} />
              </div>
            ) : (
              <Button className="w-full" onClick={handleTakeQuizClick}>
                Take Quiz
                <ArrowRight />
              </Button>
            )}
          </CardFooter>
        </Card>
      </ContextMenuTrigger>
    </ContextMenu>
  )
}
