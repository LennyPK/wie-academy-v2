"use server"

import { auth } from "@/lib/auth"
import { ROUTES } from "@/lib/constants"
import { prisma } from "@/lib/prisma/client"
import { FormQuestionType, FormType } from "@/lib/prisma/enums"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import * as z from "zod"
import { formSchema } from "./_components/form-schema"

export async function insertQuiz(quizPayload: z.infer<typeof formSchema>) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect(ROUTES.UNAUTHENTICATED_ERROR)
  }

  const quiz = await prisma.$transaction(async (tx) => {
    return tx.form.upsert({
      where: { id: quizPayload.id },
      create: {
        type: FormType.QUIZ,
        title: quizPayload.title,
        description: quizPayload.description,
        questions: {
          create: quizPayload.questions.map((question) => ({
            type: question.type,
            prompt: question.prompt,
            isRequired: question.isRequired,
            score: question.score,
            order: question.order,
            ...((question.type === FormQuestionType.SINGLE_SELECT ||
              question.type === FormQuestionType.MULTI_SELECT) && {
              options: {
                create: question.options.map((option) => ({
                  label: option.label,
                  value: option.value,
                  isCorrect: option.isCorrect,
                  score: option.score,
                  order: option.order,
                })),
              },
            }),
            ...(question.type === FormQuestionType.TRUE_FALSE && {
              correctAnswer: question.correctAnswer,
              trueLabel: question.trueLabel,
              falseLabel: question.falseLabel,
            }),
            ...(question.type === FormQuestionType.RATING && {
              ratingTarget: question.targetValue,
            }),
            ...(question.type === FormQuestionType.SCALE && {
              scaleMin: question.minValue,
              scaleMax: question.maxValue,
              scaleTarget: question.targetValue,
              scaleMinLabel: question.minLabel,
              scaleMaxLabel: question.maxLabel,
            }),
          })),
        },
      },
      // TODO: Edit functionality to be implemented
      update: {},
    })
  })

  return quiz
}
