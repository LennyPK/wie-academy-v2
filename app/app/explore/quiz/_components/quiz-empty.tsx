"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FileQuestion } from "lucide-react"

export default function QuizEmpty() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <FileQuestion className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold">No quizzes found</h3>
        <p className="text-sm text-muted-foreground">
          There are no quizzes available at the moment. Check back later!
        </p>
      </CardContent>
    </Card>
  )
}
