import { FormQuestionType } from "@/prisma/enums"
import { Check, List, SlidersHorizontal, SquareCheck, Star, Type } from "lucide-react"

export const questionTypeOptions = [
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
    icon: Check,
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
