"use client"

import { QuizWithQuestions } from "../types"
import QuizCard from "./card"

interface QuizListProps {
  userId: string
  userRole: string
  quizzes: QuizWithQuestions[]
}

export default function QuizList({ userId, userRole, quizzes }: QuizListProps) {
  console.log(`${userId}: ${userRole}`)

  return (
    <div className="space-y-6" role="list" aria-label="announcements">
      {quizzes.length > 0 &&
        quizzes.map((quiz) => {
          return <QuizCard key={quiz.id} userId={userId} userRole={userRole} quiz={quiz} />
        })}
    </div>
  )
}
