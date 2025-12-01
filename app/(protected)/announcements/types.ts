export type Announcement = {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  contentPlain: string
  contentHtml: string
  contentJson: unknown
  categoryId: number
  authorId: string | null
  author: { image: string | null; name: string } | null
  interactions: { isRead: boolean }[]
}
