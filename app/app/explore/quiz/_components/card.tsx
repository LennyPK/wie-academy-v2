"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu"
import { ROUTES } from "@/lib/constants"
import { FileQuestion } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { QuizWithQuestions } from "../types"

interface QuizCardProps {
  userId: string
  userRole: string
  quiz: QuizWithQuestions
}

export default function QuizCard({ userId, userRole, quiz }: QuizCardProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleQuizClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`${ROUTES.QUIZ}/${quiz.id}`)
  }

  console.log(`${userId}: ${userRole}, ${pathname}`)
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild className="cursor-pointer">
        <Card key={quiz.id} onClick={handleQuizClick}>
          <CardHeader>
            <CardTitle className="line-clamp-1">{quiz.title}</CardTitle>

            <Badge variant="outline">
              <FileQuestion />
              {quiz.questions.length || 0} Questions
            </Badge>
          </CardHeader>

          <CardContent className="line-clamp-2 text-sm">{quiz.description}</CardContent>
        </Card>
      </ContextMenuTrigger>
    </ContextMenu>
  )
}
