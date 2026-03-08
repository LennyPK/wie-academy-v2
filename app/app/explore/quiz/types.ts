// export type Quiz = {
//   id: string
//   type: FormType.quiz
// }

import { Prisma } from "@/lib/generated/prisma/client"

// export interface Quiz {
//   id: string
//   type: FormType

//   title: string
//   description: string
//   createdAt: Date
//   updatedAt: Date
// }

const quizWithQuestions = {
  include: {
    questions: { include: { options: true } },
  },
} satisfies Prisma.FormDefaultArgs

type QuizWithQuestions = Prisma.FormGetPayload<typeof quizWithQuestions>

type QuizScoreData = {
  bestScore: number | null
  attemptCount: number
}

type QuizScores = Record<string, QuizScoreData>

export type { QuizScoreData, QuizScores, QuizWithQuestions }

console.log(quizWithQuestions)
