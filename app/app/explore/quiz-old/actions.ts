"use server"

import { auth } from "@/lib/auth"
import { ROUTES } from "@/lib/constants"
import { prisma } from "@/prisma/client"
import { FormType } from "@/prisma/enums"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import type {
  AnswerResult,
  NewQuiz,
  QuizAnswerPayload,
  QuizConfigCheckbox,
  QuizConfigMultiChoice,
  QuizConfigRating,
  QuizConfigScale,
  QuizConfigText,
  QuizConfigYesNo,
  SubmitQuizResult,
} from "./types"

export async function createQuiz(quizData: NewQuiz) {
  // Auth check
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    redirect(ROUTES.UNAUTHENTICATED_ERROR)
  }

  // Use Prisma transaction for atomic creation
  const quiz = await prisma.$transaction(async (tx) => {
    // Create Form with nested questions and options
    const form = await tx.form.create({
      data: {
        type: FormType.QUIZ,
        title: quizData.title,
        description: quizData.description,
        eventId: quizData.eventId ?? null,
        questions: {
          create: quizData.questions.map((q, qIndex) => {
            // Base question data
            const baseData = {
              questionText: q.questionText,
              type: q.type,
              isRequired: q.isRequired,
              orderIndex: qIndex,
              explanation: q.explanation || null,
              score: q.score || null,
            }

            // Handle different question types
            switch (q.type) {
              case "MULTICHOICE":
              case "CHECKBOX":
                return {
                  ...baseData,
                  quizConfig: {
                    correctOptionIndexes: q.correctOptionIndexes,
                  },
                  options: {
                    create: q.options.map((opt, optIndex) => ({
                      label: opt.label,
                      value: opt.value,
                      orderIndex: optIndex,
                    })),
                  },
                }

              case "YES_NO":
                return {
                  ...baseData,
                  quizConfig: {
                    correctAnswer: q.correctAnswer,
                  },
                }

              case "TEXT":
                return {
                  ...baseData,
                  quizConfig: {
                    acceptableAnswers: q.acceptableAnswers,
                    caseSensitive: q.caseSensitive,
                  },
                }

              case "RATING":
                return {
                  ...baseData,
                  quizConfig: q.correctRating
                    ? {
                        correctRating: q.correctRating,
                      }
                    : undefined,
                }

              case "SCALE":
                return {
                  ...baseData,
                  quizConfig: q.correctValue
                    ? {
                        correctValue: q.correctValue,
                      }
                    : undefined,
                }

              // default:
              //   // Should never reach here due to TypeScript discriminated unions
              //   throw new Error(`Unknown question type: ${(q as any).type}`)
            }
          }),
        },
      },
      include: {
        questions: {
          include: {
            options: true,
          },
          orderBy: { orderIndex: "asc" },
        },
      },
    })

    return form
  })

  return quiz
}

export async function getQuizWithResponses(quizId: string) {
  // Auth check
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    redirect(ROUTES.UNAUTHENTICATED_ERROR)
  }

  const userId = session.user.id

  // Fetch quiz with all questions and options
  const quiz = await prisma.form.findUnique({
    where: { id: quizId, type: FormType.QUIZ },
    include: {
      questions: {
        include: {
          options: {
            orderBy: { orderIndex: "asc" },
          },
        },
        orderBy: { orderIndex: "asc" },
      },
    },
  })

  if (!quiz) {
    return { quiz: null, responses: [] }
  }

  // Fetch user's previous responses for this quiz
  const responses = await prisma.formResponse.findMany({
    where: {
      formId: quizId,
      userId: userId,
    },
    include: {
      answers: {
        include: {
          question: true,
        },
      },
    },
    orderBy: { submittedAt: "desc" },
  })

  return { quiz, responses }
}

export async function submitQuizResponse(
  quizId: string,
  answers: QuizAnswerPayload[]
): Promise<SubmitQuizResult> {
  // Auth check
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    redirect(ROUTES.UNAUTHENTICATED_ERROR)
  }

  const userId = session.user.id

  // Fetch quiz with questions to validate and calculate scores
  const quiz = await prisma.form.findUnique({
    where: { id: quizId, type: FormType.QUIZ },
    include: {
      questions: {
        include: {
          options: {
            orderBy: { orderIndex: "asc" },
          },
        },
        orderBy: { orderIndex: "asc" },
      },
    },
  })

  if (!quiz) {
    throw new Error("Quiz not found")
  }

  // Calculate scores for each answer
  const results: AnswerResult[] = []
  let totalScore = 0
  let maxScore = 0

  for (const answer of answers) {
    const question = quiz.questions.find((q) => q.id === answer.questionId)
    if (!question) continue

    // Add to max possible score
    if (question.score) {
      maxScore += question.score
    }

    // Calculate if answer is correct and score earned
    const result = calculateAnswerScore(question, answer)
    results.push(result)

    if (result.score) {
      totalScore += result.score
    }
  }

  // Create response and answers in transaction
  const response = await prisma.$transaction(async (tx) => {
    // Create FormResponse
    const formResponse = await tx.formResponse.create({
      data: {
        formId: quizId,
        userId: userId,
        total: totalScore,
        isAnonymous: false,
      },
    })

    // Create FormAnswers
    const now = new Date()
    await Promise.all(
      results.map((result) => {
        const userAnswer = answers.find((a) => a.questionId === result.questionId)
        return tx.formAnswer.create({
          data: {
            questionId: result.questionId,
            responseId: formResponse.id,
            valueString: userAnswer?.valueString,
            valueInt: userAnswer?.valueInt,
            valueBoolean: userAnswer?.valueBoolean,
            valueJson: userAnswer?.valueJson as never,
            isCorrect: result.isCorrect,
            score: result.score,
            updatedAt: now,
          },
        })
      })
    )

    return formResponse
  })

  return {
    responseId: response.id,
    score: totalScore,
    maxScore: maxScore,
    results: results,
  }
}

// Helper function to calculate score for a single answer
function calculateAnswerScore(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  question: any,
  answer: QuizAnswerPayload
): AnswerResult {
  const questionScore = question.score || 0
  let isCorrect: boolean | null = null
  let correctAnswer: unknown = undefined

  if (!question.quizConfig) {
    // No correct answer defined (feedback question)
    return {
      questionId: question.id,
      isCorrect: null,
      score: null,
      explanation: question.explanation,
    }
  }

  const config = question.quizConfig

  switch (question.type) {
    case "MULTICHOICE": {
      const mcConfig = config as QuizConfigMultiChoice
      const selectedIndex = answer.valueInt
      isCorrect = mcConfig.correctOptionIndexes.includes(selectedIndex ?? -1)
      correctAnswer = mcConfig.correctOptionIndexes.map((idx) => question.options[idx]?.label)
      break
    }

    case "CHECKBOX": {
      const cbConfig = config as QuizConfigCheckbox
      const selectedIndexes = (answer.valueJson as number[]) || []
      const correctSet = new Set(cbConfig.correctOptionIndexes)
      const selectedSet = new Set(selectedIndexes)
      isCorrect =
        correctSet.size === selectedSet.size && [...correctSet].every((idx) => selectedSet.has(idx))
      correctAnswer = cbConfig.correctOptionIndexes.map((idx) => question.options[idx]?.label)
      break
    }

    case "YES_NO": {
      const ynConfig = config as QuizConfigYesNo
      isCorrect = answer.valueBoolean === ynConfig.correctAnswer
      correctAnswer = ynConfig.correctAnswer
      break
    }

    case "TEXT": {
      const textConfig = config as QuizConfigText
      const userAnswer = answer.valueString || ""
      const acceptable = textConfig.acceptableAnswers || []

      if (textConfig.caseSensitive) {
        isCorrect = acceptable.includes(userAnswer)
      } else {
        isCorrect = acceptable.some((ans) => ans.toLowerCase() === userAnswer.toLowerCase())
      }
      correctAnswer = acceptable
      break
    }

    case "RATING": {
      const ratingConfig = config as QuizConfigRating
      if (ratingConfig.correctRating !== undefined && ratingConfig.correctRating !== null) {
        isCorrect = answer.valueInt === ratingConfig.correctRating
        correctAnswer = ratingConfig.correctRating
      } else {
        // No correct answer for this rating question
        isCorrect = null
      }
      break
    }

    case "SCALE": {
      const scaleConfig = config as QuizConfigScale
      if (scaleConfig.correctValue !== undefined && scaleConfig.correctValue !== null) {
        isCorrect = answer.valueInt === scaleConfig.correctValue
        correctAnswer = scaleConfig.correctValue
      } else {
        // No correct answer for this scale question
        isCorrect = null
      }
      break
    }
  }

  return {
    questionId: question.id,
    isCorrect,
    score: isCorrect === true ? questionScore : 0,
    correctAnswer,
    explanation: question.explanation,
  }
}
