"use client"

import { QuizScores, QuizWithQuestions } from "@/explore/quiz/types"
import QuizCard from "./card"

interface QuizListProps {
  userRole: string
  quizzes: QuizWithQuestions[]
  quizScores: QuizScores
}

export default function QuizList({ userRole, quizzes, quizScores }: QuizListProps) {
  return (
    <div
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
      role="list"
      aria-label="announcements"
    >
      {quizzes.length > 0 &&
        quizzes.map((quiz) => {
          return (
            <QuizCard
              key={quiz.id}
              userRole={userRole}
              quiz={quiz}
              scoreData={quizScores[quiz.id]}
            />
          )
        })}
    </div>
  )
}
