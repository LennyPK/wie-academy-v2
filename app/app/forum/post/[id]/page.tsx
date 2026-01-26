import BackButton from "@/components/back-button"
import { auth } from "@/lib/auth"
import { ROUTES } from "@/lib/constants"
import { prisma } from "@/lib/prisma/client"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import ForumDetail from "../../_components/detail"

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect(ROUTES.UNAUTHENTICATED_ERROR)
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true },
  })

  if (!user) {
    redirect(ROUTES.UNAUTHENTICATED_ERROR)
  }

  const { id } = await params

  const post = await prisma.post.findUnique({
    where: { id: id },
    include: {
      postReplies: {
        include: {
          author: {
            select: { id: true, image: true, name: true, firstName: true, lastName: true },
          },
        },
      },
      category: { select: { id: true, label: true } },
      author: { select: { id: true, image: true, name: true, firstName: true, lastName: true } },
    },
  })

  if (!post) {
    return
  }

  return (
    <div>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <BackButton />
        <ForumDetail userId={user.id} userRole={user.role} post={post} />
      </main>
    </div>
  )
}
