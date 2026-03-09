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

export const quizWithQuestions = {
  include: {
    questions: { include: { options: true } },
  },
} satisfies Prisma.FormDefaultArgs

export const quizAttempt = {
  select: { id: true, total: true, submittedAt: true },
} satisfies Prisma.FormResponseDefaultArgs

type QuizWithQuestions = Prisma.FormGetPayload<typeof quizWithQuestions>

type QuizAttempt = Prisma.FormResponseGetPayload<typeof quizAttempt>

type QuizScoreData = {
  bestScore: number | null
  attemptCount: number
}

type QuizScores = Record<string, QuizScoreData>

export type { QuizAttempt, QuizScoreData, QuizScores, QuizWithQuestions }

console.log(quizWithQuestions, quizAttempt)
