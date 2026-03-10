import { FormQuestionType } from "@/prisma/enums"
import { CheckCheck, List, SlidersHorizontal, SquareCheck, Star, Type } from "lucide-react"

const questionTypeOptions = [
  {
    value: FormQuestionType.TEXT,
    label: "Text",
    icon: Type,
  },
  {
    value: FormQuestionType.SINGLE_SELECT,
    label: "Multiple Choice",
    icon: List,
  },
  {
    value: FormQuestionType.MULTI_SELECT,
    label: "Checkbox",
    icon: SquareCheck,
  },
  {
    value: FormQuestionType.TRUE_FALSE,
    label: "True / False",
    icon: CheckCheck,
  },
  {
    value: FormQuestionType.RATING,
    label: "Rating",
    icon: Star,
  },
  {
    value: FormQuestionType.SCALE,
    label: "Scale",
    icon: SlidersHorizontal,
  },
]

const quizAllowedTypes = new Set<FormQuestionType>([
  FormQuestionType.SINGLE_SELECT,
  FormQuestionType.MULTI_SELECT,
  FormQuestionType.TRUE_FALSE,
])

export const quizQuestionTypeOptions = questionTypeOptions.filter((option) =>
  quizAllowedTypes.has(option.value)
)

export const surveyQuestionTypeOptions = questionTypeOptions
