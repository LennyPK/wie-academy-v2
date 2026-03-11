import { Prisma } from "@/lib/generated/prisma/client"

const quizWithQuestions = {
  include: {
    questions: { include: { options: true } },
  },
} satisfies Prisma.QuestionnaireDefaultArgs

const quizAttempt = {
  select: { id: true, total: true, submittedAt: true },
} satisfies Prisma.QuestionnaireResponseDefaultArgs

const quizResult = {
  include: {
    questionnaire: {
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
} satisfies Prisma.QuestionnaireResponseDefaultArgs

type QuizWithQuestions = Prisma.QuestionnaireGetPayload<typeof quizWithQuestions>

type QuizAttempt = Prisma.QuestionnaireResponseGetPayload<typeof quizAttempt>

type QuizResult = Prisma.QuestionnaireResponseGetPayload<typeof quizAttempt>

type QuizScoreData = {
  bestScore: number | null
  attemptCount: number
}

type QuizScores = Record<string, QuizScoreData>

export { quizAttempt, quizResult, quizWithQuestions }

export type { QuizAttempt, QuizResult, QuizScoreData, QuizScores, QuizWithQuestions }
