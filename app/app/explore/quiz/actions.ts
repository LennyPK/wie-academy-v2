"use server"

import { ROUTES } from "@/constants"
import { auth } from "@/lib/auth"
import { prisma } from "@/prisma/client"
import { QuestionnaireQuestionType, QuestionnaireType } from "@/prisma/enums"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import * as z from "zod"
import { attemptSchema } from "./_components/attempt-form/form-schema"
import { formSchema } from "./_components/form/form-schema"

export async function insertQuiz(quizPayload: z.infer<typeof formSchema>) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect(ROUTES.UNAUTHENTICATED_ERROR)
  }

  const quiz = await prisma.$transaction(async (tx) => {
    return tx.questionnaire.upsert({
      where: { id: quizPayload.id },
      create: {
        type: QuestionnaireType.QUIZ,
        title: quizPayload.title,
        description: quizPayload.description,
        questions: {
          create: quizPayload.questions.map((question) => ({
            type: question.type,
            prompt: question.prompt,
            isRequired: question.isRequired,
            score: question.score,
            order: question.order,
            ...((question.type === QuestionnaireQuestionType.SINGLE_SELECT ||
              question.type === QuestionnaireQuestionType.MULTI_SELECT) && {
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
            ...(question.type === QuestionnaireQuestionType.TRUE_FALSE && {
              trueFalseAnswer: question.correctAnswer,
              trueLabel: question.trueLabel,
              falseLabel: question.falseLabel,
            }),
            ...(question.type === QuestionnaireQuestionType.RATING && {
              ratingTarget: question.targetValue,
            }),
            ...(question.type === QuestionnaireQuestionType.SCALE && {
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

export async function insertQuizResponse(
  quizId: string,
  answers: z.infer<typeof attemptSchema>["answers"]
) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect(ROUTES.UNAUTHENTICATED_ERROR)
  }

  // Fetch questions
  const questions = await prisma.questionnaireQuestion.findMany({
    where: { questionnaireId: quizId },
    include: { options: true },
  })

  const response = await prisma.$transaction(async (tx) => {
    const questionnaireResponse = await tx.questionnaireResponse.create({
      data: { questionnaireId: quizId, userId: session.user.id },
    })

    let totalScore = 0

    for (const answer of answers) {
      const question = questions.find((question) => question.id === answer.questionId)

      if (!question) continue

      let isCorrect: boolean | null = null
      let score: number = 0

      if (answer.type === QuestionnaireQuestionType.TRUE_FALSE) {
        isCorrect = answer.value === question.trueFalseAnswer
        score = isCorrect ? (question.score ?? 0) : 0

        await tx.questionnaireAnswer.create({
          data: {
            questionId: answer.questionId,
            responseId: questionnaireResponse.id,
            valueBoolean: answer.value,
            isCorrect,
            score,
          },
        })
      }

      if (answer.type === QuestionnaireQuestionType.SINGLE_SELECT) {
        const selected = question.options.find((option) => option.value === answer.value)
        isCorrect = selected?.isCorrect ?? false
        score = isCorrect ? (question.score ?? 0) : 0

        await tx.questionnaireAnswer.create({
          data: {
            questionId: answer.questionId,
            responseId: questionnaireResponse.id,
            ...(selected && { valueOptions: { create: [{ optionId: selected.id }] } }),
            isCorrect,
            score,
          },
        })
      }

      if (answer.type === QuestionnaireQuestionType.MULTI_SELECT) {
        const selectedOptions = question.options.filter((option) =>
          answer.values.includes(option.value)
        )
        const correctOptions = question.options.filter((option) => option.isCorrect)
        const hasIncorrectSelection = selectedOptions.some((option) => !option.isCorrect)

        isCorrect = !hasIncorrectSelection && selectedOptions.length === correctOptions.length

        score = hasIncorrectSelection
          ? 0
          : selectedOptions
              .filter((option) => option.isCorrect)
              .reduce((sum, option) => sum + option.score, 0)

        await tx.questionnaireAnswer.create({
          data: {
            questionId: answer.questionId,
            responseId: questionnaireResponse.id,
            valueOptions: { create: selectedOptions.map((option) => ({ optionId: option.id })) },
            isCorrect,
            score,
          },
        })
      }

      totalScore += score
    }

    return tx.questionnaireResponse.update({
      where: { id: questionnaireResponse.id },
      data: { total: totalScore },
    })
  })

  return response
}
