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

const quizAttempt = {
  select: { id: true, total: true, submittedAt: true },
} satisfies Prisma.FormResponseDefaultArgs

const quizResult = {
  include: {
    form: {
      include: {
        questions: {
          include: { options: true },
          orderBy: { order: "asc" },
        },
      },
    },
    answers: {
      include: {
        question: true,
        valueOptions: { include: { option: true } },
      },
    },
  },
} satisfies Prisma.FormResponseDefaultArgs

type QuizWithQuestions = Prisma.FormGetPayload<typeof quizWithQuestions>

type QuizAttempt = Prisma.FormResponseGetPayload<typeof quizAttempt>

type QuizResult = Prisma.FormResponseGetPayload<typeof quizAttempt>

type QuizScoreData = {
  bestScore: number | null
  attemptCount: number
}

type QuizScores = Record<string, QuizScoreData>

export { quizAttempt, quizResult, quizWithQuestions }

export type { QuizAttempt, QuizResult, QuizScoreData, QuizScores, QuizWithQuestions }
