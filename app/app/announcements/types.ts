import { AnnouncementInteractionType } from "@/prisma/enums"
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

  // interactions: { isRead: boolean }[]
  interactions: {
    userId: string
    type: AnnouncementInteractionType
    announcementId: string
  }[]
  targetRegions: { region: { id: number; label: string } }[]
  targetSchools: { school: { id: number; label: string } }[]
  targetYearLevels: { yearLevel: { id: number; label: string } }[]

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
