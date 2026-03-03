"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { usePathname, useRouter } from "next/navigation"
import { QuizWithQuestions } from "../../types"

interface QuizDetailProps {
  quiz: QuizWithQuestions
}

export default function QuizDetail({ quiz }: QuizDetailProps) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
        <CardDescription>{quiz.questions.length} Questions</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={() => {
            router.push(`${pathname}/attempt`)
          }}
        >
          Take Quiz
        </Button>
      </CardContent>
    </Card>
  )
}
