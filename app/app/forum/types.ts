import { InputJsonValue, JsonValue } from "@prisma/client/runtime/client"

export type Post = {
  id: string
  title: string

  contentPlain: string
  contentHtml: string
  contentJson: JsonValue

  isAnonymous: boolean
  isPrivate: boolean

  categoryId: number
  category: { id: number; label: string }

  authorId: string | null
  author: {
    id: string
    image: string | null
    name: string
    firstName: string
    lastName: string
  } | null

  createdAt: Date
  updatedAt: Date
}

export type NewPost = {
  id?: string
  title: string
  contentPlain: string
  contentHtml: string
  contentJson: InputJsonValue

  isAnonymous: boolean
  isPrivate: boolean

  categoryId: number
}
