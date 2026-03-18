import BackButton from "@/components/back-button"
import { prisma } from "@/lib/prisma/client"
import { notFound } from "next/navigation"
import ForumForm from "../../_components/form"

export default async function ForumPostEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const post = await prisma.post.findUnique({
    where: { id: id },
    include: {
      category: { select: { id: true, label: true } },
      author: { select: { id: true, image: true, name: true, firstName: true, lastName: true } },
      interactions: { where: { postId: "__never__" } },
    },
  })

  if (!post) notFound()

  return (
    <div>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <BackButton />
        <ForumForm post={post} />
      </main>
    </div>
  )
}
