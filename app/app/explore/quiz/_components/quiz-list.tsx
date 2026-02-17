"use client"

import QuizCard from "./quiz-card"

interface QuizListProps {
  quizzes: Array<{
    id: string
    title: string
    description: string | null
    createdAt: Date
    updatedAt: Date
    _count?: {
      questions: number
    }
  }>
  userScores?: Record<
    string,
    {
      bestScore: number
      maxScore: number
      attemptCount: number
    }
  >
}

export default function QuizList({ quizzes, userScores = {} }: QuizListProps) {
  return (
    <div className="space-y-6" role="list" aria-label="quizzes">
      {quizzes.map((quiz) => {
        const userScore = userScores[quiz.id]
        return (
          <QuizCard
            key={quiz.id}
            quiz={quiz}
            userBestScore={
              userScore
                ? {
                    score: userScore.bestScore,
                    maxScore: userScore.maxScore,
                  }
                : null
            }
            attemptCount={userScore?.attemptCount || 0}
          />
        )
      })}
    </div>
  )
}
