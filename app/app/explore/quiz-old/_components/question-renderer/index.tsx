"use client"

import type { QuizQuestion } from "../../types"
import CheckboxQuestion from "./checkbox-question"
import MultiChoiceQuestion from "./multichoice-question"
import RatingQuestion from "./rating-question"
import ScaleQuestion from "./scale-question"
import TextQuestion from "./text-question"
import YesNoQuestion from "./yes-no-question"

type QuestionRendererProps = {
  question: QuizQuestion
  value: unknown
  onChange: (value: unknown) => void
  disabled?: boolean
  showCorrect?: boolean
  userAnswer?: unknown
  isCorrect?: boolean | null
}

export default function QuestionRenderer({
  question,
  value,
  onChange,
  disabled = false,
  showCorrect = false,
  userAnswer,
  isCorrect,
}: QuestionRendererProps) {
  const commonProps = {
    question,
    value,
    onChange,
    disabled,
    showCorrect,
    userAnswer,
    isCorrect,
  }

  switch (question.type) {
    case "MULTICHOICE":
      return <MultiChoiceQuestion {...commonProps} />

    case "CHECKBOX":
      return <CheckboxQuestion {...commonProps} />

    case "YES_NO":
      return <YesNoQuestion {...commonProps} />

    case "TEXT":
      return <TextQuestion {...commonProps} />

    case "RATING":
      return <RatingQuestion {...commonProps} />

    case "SCALE":
      return <ScaleQuestion {...commonProps} />

    default:
      return <div>Unknown question type</div>
  }
}
