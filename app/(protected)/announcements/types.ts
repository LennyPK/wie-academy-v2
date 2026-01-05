import { InputJsonValue, JsonValue } from "@prisma/client/runtime/client"

export type Announcement = {
  id: string
  title: string

  contentPlain: string
  contentHtml: string
  contentJson: JsonValue

  categoryId: number
  category: { id: number; label: string }

  authorId: string | null
  author: { image: string | null; name: string } | null

  interactions: { isRead: boolean }[]
  targetRegions: { regionId: number }[]
  targetSchools: { schoolId: number }[]
  targetYearLevels: { yearLevelId: number }[]

  createdAt: Date
  updatedAt: Date
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
