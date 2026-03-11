"use client"

import { QuizScores, QuizWithQuestions } from "@/explore/quiz/types"
import QuizCard from "./card"

interface QuizListProps {
  quizzes: QuizWithQuestions[]
  quizScores: QuizScores
}

export default function QuizList({ quizzes, quizScores }: QuizListProps) {
  return (
    <div
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
      role="list"
      aria-label="announcements"
    >
      {quizzes.length > 0 &&
        quizzes.map((quiz) => {
          return <QuizCard key={quiz.id} quiz={quiz} scoreData={quizScores[quiz.id]} />
        })}
    </div>
  )
}
