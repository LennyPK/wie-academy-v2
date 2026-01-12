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
  author: { image: string | null; name: string } | null

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
