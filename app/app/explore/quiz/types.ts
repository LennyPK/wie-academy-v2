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

export type QuizWithQuestions = Prisma.FormGetPayload<typeof quizWithQuestions>

console.log(quizWithQuestions)
