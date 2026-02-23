// Base question type
export type BaseQuestion = {
  questionText: string
  isRequired?: boolean
  explanation?: string
  score?: number
  orderIndex: number
}

// Question type variants
export type MultiChoiceQuestion = BaseQuestion & {
  type: "MULTICHOICE"
  options: Array<{
    label: string
    value: string
    orderIndex: number
    isCorrect: boolean
  }>
}

export type CheckboxQuestion = BaseQuestion & {
  type: "CHECKBOX"
  options: Array<{
    label: string
    value: string
    orderIndex: number
    isCorrect: boolean
  }>
}

export type YesNoQuestion = BaseQuestion & {
  type: "YES_NO"
  correctAnswer?: boolean
}

export type TextQuestion = BaseQuestion & {
  type: "TEXT"
  placeholder?: string
  maxLength?: number
  acceptableAnswers?: string[]
  caseSensitive?: boolean
}

export type RatingQuestion = BaseQuestion & {
  type: "RATING"
  maxRating?: number
  iconStyle?: "star" | "heart" | "thumbs"
  correctRating?: number
}

export type ScaleQuestion = BaseQuestion & {
  type: "SCALE"
  minValue?: number
  maxValue?: number
  step?: number
  minLabel?: string
  maxLabel?: string
  correctValue?: number
}

// Discriminated union of all question types
export type Question =
  | MultiChoiceQuestion
  | CheckboxQuestion
  | YesNoQuestion
  | TextQuestion
  | RatingQuestion
  | ScaleQuestion

// Form data shape
export type QuizFormData = {
  title: string
  description: string
  questions: Question[]
}
