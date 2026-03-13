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
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Progress } from "@/components/ui/progress"
import { ROUTES } from "@/constants"
import { QuizScoreData, QuizWithQuestions } from "@/explore/quiz/types"
import { Role } from "@/prisma/enums"
import { highlightText } from "@/utils"
import { ArrowRight, BarChart3, CircleQuestionMark, Edit } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface QuizCardProps {
  userRole: string
  quiz: QuizWithQuestions
  scoreData: QuizScoreData
}

export default function QuizCard({ userRole, quiz, scoreData }: QuizCardProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isAdmin = userRole === Role.ADMIN

  const maxScore = quiz.questions.reduce((sum, question) => sum + (question.score ?? 0), 0)

  const searchQuery = searchParams.get("query")

  const handleQuizClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`${ROUTES.QUIZ}/${quiz.id}`)
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    router.push(`${ROUTES.QUIZ}/edit/${quiz.id}`)
  }

  const handleTakeQuizClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`${ROUTES.QUIZ}/${quiz.id}/attempt`)
  }

  const contextMenu = (() => {
    if (isAdmin) {
      return (
        <ContextMenuContent>
          <ContextMenuItem onClick={handleEditClick}>
            <Edit />
            <span>Edit</span>
          </ContextMenuItem>
        </ContextMenuContent>
      )
    }
  })()

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild className="cursor-pointer">
        <Card key={quiz.id} onClick={handleQuizClick}>
          <CardHeader>
            <CardTitle className="line-clamp-1">
              {highlightText(quiz.title, searchQuery ?? "")}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {quiz.description && highlightText(quiz.description, searchQuery ?? "")}
            </CardDescription>
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
                <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Best Score: {scoreData.bestScore ?? 0} / {maxScore}
                  </span>
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
      {contextMenu}
    </ContextMenu>
  )
}
