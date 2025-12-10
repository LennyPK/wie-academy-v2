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
  category: { id: number; value: string; label: string }
  author: { image: string | null; name: string } | null
  interactions: { isRead: boolean }[]
}
