import { InputJsonValue, JsonValue } from "@prisma/client/runtime/client"

export type Event = {
  id: string
  title: string

  descriptionPlain: string
  descriptionHtml: string
  descriptionJson: JsonValue

  categoryId: number
  category: { id: number; value: string; label: string }

  location: string
  capacity: number

  startDateTime: Date
  endDateTime: Date

  createdAt: Date
  updatedAt: Date
}

export type NewEvent = {
  id?: string
  title: string
  descriptionPlain: string
  descriptionHtml: string
  descriptionJson: InputJsonValue
  categoryId: number
  location: string
  capacity: number
  startDateTime: Date
  endDateTime: Date
}
