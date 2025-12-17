import { JsonValue } from "@/lib/generated/prisma/internal/prismaNamespace"
import { InputJsonValue } from "@prisma/client/runtime/client"

export type Announcement = {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  contentPlain: string
  contentHtml: string
  contentJson: JsonValue
  categoryId: number
  authorId: string | null
  category: { id: number; value: string; label: string }
  author: { image: string | null; name: string } | null
  interactions: { isRead: boolean }[]
  targetRegions: { regionId: number }[]
  targetSchools: { schoolId: number }[]
  targetYearLevels: { yearLevelId: number }[]
}

export type Region = {
  regionId: number
}

export type School = {
  schoolId: number
}

export type YearLevel = {
  yearLevelId: number
}

export type NewAnnouncement = {
  id?: string
  title: string
  contentPlain: string
  contentHtml: string
  contentJson: InputJsonValue
  categoryId: number
  schoolIds: number[]
  regionIds: number[]
  yearLevelIds: number[]
}

export type AnnouncementCategory = {
  id: number
  value: string
  label: string
}
