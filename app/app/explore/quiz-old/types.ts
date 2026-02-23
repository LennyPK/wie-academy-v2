import { FormQuestionType } from "@/lib/generated/prisma/enums"

// Quiz configuration stored in JSON field (type-specific correct answer data)
export type QuizConfigMultiChoice = {
  correctOptionIndexes: number[]
}

export type QuizConfigCheckbox = {
  correctOptionIndexes: number[]
}

export type QuizConfigYesNo = {
  correctAnswer: boolean
}

export type QuizConfigText = {
  acceptableAnswers: string[]
  caseSensitive: boolean
}

export type QuizConfigRating = {
  correctRating?: number
}

export type QuizConfigScale = {
  correctValue?: number
}

export type QuizConfig =
  | QuizConfigMultiChoice
  | QuizConfigCheckbox
  | QuizConfigYesNo
  | QuizConfigText
  | QuizConfigRating
  | QuizConfigScale

// Option shape (matches FormOption model)
export type QuizOption = {
  id: string
  questionId: string
  label: string
  value: string
  orderIndex: number
}

// Question shape (matches FormQuestion model with relations)
export type QuizQuestion = {
  id: string
  formId: string
  questionText: string
  type: FormQuestionType
  isRequired: boolean
  explanation: string | null
  score: number | null
  quizConfig: QuizConfig | null
  orderIndex: number
  options: QuizOption[]
}

// Complete quiz shape (matches Form model with relations)
export type Quiz = {
  id: string
  type: "QUIZ"
  eventId: string | null
  title: string
  description: string | null
  createdAt: Date
  updatedAt: Date
  questions: QuizQuestion[]
}

// Base question payload (common fields)
type BaseQuestionPayload = {
  questionText: string
  isRequired: boolean
  explanation?: string | null
  score?: number | null
  orderIndex: number
}

// Type-specific question payloads
type MultiChoiceQuestionPayload = BaseQuestionPayload & {
  type: "MULTICHOICE"
  correctOptionIndexes: number[]
  options: Array<{
    label: string
    value: string
    orderIndex: number
  }>
}

type CheckboxQuestionPayload = BaseQuestionPayload & {
  type: "CHECKBOX"
  correctOptionIndexes: number[]
  options: Array<{
    label: string
    value: string
    orderIndex: number
  }>
}

type YesNoQuestionPayload = BaseQuestionPayload & {
  type: "YES_NO"
  correctAnswer: boolean
}

type TextQuestionPayload = BaseQuestionPayload & {
  type: "TEXT"
  acceptableAnswers: string[]
  caseSensitive: boolean
}

type RatingQuestionPayload = BaseQuestionPayload & {
  type: "RATING"
  correctRating?: number
}

type ScaleQuestionPayload = BaseQuestionPayload & {
  type: "SCALE"
  correctValue?: number
}

// Payload for creating a new quiz (server action input)
export type NewQuiz = {
  id?: string
  eventId?: string
  title: string
  description: string
  questions: Array<
    | MultiChoiceQuestionPayload
    | CheckboxQuestionPayload
    | YesNoQuestionPayload
    | TextQuestionPayload
    | RatingQuestionPayload
    | ScaleQuestionPayload
  >
}

// ============ Quiz Response & Submission Types ============

// Quiz answer for a single question (submission payload)
export type QuizAnswerPayload = {
  questionId: string
  // One of these will be populated based on question type:
  valueString?: string | null
  valueInt?: number | null
  valueBoolean?: boolean | null
  valueJson?: unknown | null // For CHECKBOX (array of selected option indexes)
}

// Answer with scoring info (server action response)
export type AnswerResult = {
  questionId: string
  isCorrect: boolean | null // null for feedback questions (no correct answer)
  score: number | null // points earned for this answer
  correctAnswer?: unknown // What the correct answer was (for showing after submission)
  explanation?: string | null // Explanation from question
}

// Single quiz answer (matches FormAnswer model)
export type QuizAnswer = {
  id: string
  questionId: string
  responseId: string
  valueString: string | null
  valueInt: number | null
  valueBoolean: boolean | null
  valueJson: unknown | null
  isCorrect: boolean | null
  score: number | null
  createdAt: Date
  updatedAt: Date
}

// Quiz response with answers (matches FormResponse model with relations)
export type QuizResponse = {
  id: string
  formId: string
  userId: string
  total: number // Total score achieved
  isAnonymous: boolean | null
  submittedAt: Date
  answers: QuizAnswer[]
}

// Response from submitQuizResponse server action
export type SubmitQuizResult = {
  responseId: string
  score: number // Points earned
  maxScore: number // Total possible points
  results: AnswerResult[]
}
