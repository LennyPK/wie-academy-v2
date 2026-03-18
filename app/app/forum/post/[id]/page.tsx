import BackButton from "@/components/back-button"
import { requireSession } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma/client"
import { PostInteractionType } from "@/lib/prisma/enums"
import { notFound } from "next/navigation"
import ForumDetail from "../../_components/detail"
import { markAsRead } from "../../actions"

export default async function ForumPostPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession()
  const user = session.user

  const { id } = await params

  const post = await prisma.post.findUnique({
    where: { id: id },
    include: {
      replies: {
        include: {
          author: {
            select: { id: true, image: true, name: true, firstName: true, lastName: true },
          },
        },
      },
      category: { select: { id: true, label: true } },
      author: { select: { id: true, image: true, name: true, firstName: true, lastName: true } },
      interactions: { where: { userId: user.id } },
    },
  })

  if (!post) notFound()

  await markAsRead(id, user.id)

  const [viewCount, likeCount] = await Promise.all([
    prisma.postInteraction.count({
      where: { postId: id, type: PostInteractionType.VIEW },
    }),

    prisma.postInteraction.count({
      where: { postId: id, type: PostInteractionType.LIKE },
    }),
  ])

  return (
    <div>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <BackButton />
        <ForumDetail
          userId={user.id}
          userRole={user.role}
          post={post}
          viewCount={viewCount}
          likeCount={likeCount}
        />
      </main>
    </div>
  )
}
