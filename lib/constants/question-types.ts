import { QuestionnaireQuestionType } from "@/prisma/enums"
import { CheckCheck, List, SlidersHorizontal, SquareCheck, Star, Type } from "lucide-react"

const questionTypeOptions = [
  {
    value: QuestionnaireQuestionType.TEXT,
    label: "Text",
    icon: Type,
  },
  {
    value: QuestionnaireQuestionType.SINGLE_SELECT,
    label: "Multiple Choice",
    icon: List,
  },
  {
    value: QuestionnaireQuestionType.MULTI_SELECT,
    label: "Checkbox",
    icon: SquareCheck,
  },
  {
    value: QuestionnaireQuestionType.TRUE_FALSE,
    label: "True / False",
    icon: CheckCheck,
  },
  {
    value: QuestionnaireQuestionType.RATING,
    label: "Rating",
    icon: Star,
  },
  {
    value: QuestionnaireQuestionType.SCALE,
    label: "Scale",
    icon: SlidersHorizontal,
  },
]

const quizAllowedTypes = new Set<QuestionnaireQuestionType>([
  QuestionnaireQuestionType.SINGLE_SELECT,
  QuestionnaireQuestionType.MULTI_SELECT,
  QuestionnaireQuestionType.TRUE_FALSE,
])

export const quizQuestionTypeOptions = questionTypeOptions.filter((option) =>
  quizAllowedTypes.has(option.value)
)

export const surveyQuestionTypeOptions = questionTypeOptions
