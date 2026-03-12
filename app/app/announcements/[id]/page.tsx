import AnnouncementDetail from "@/announcements/_components/detail"
import BackButton from "@/components/back-button"
import { ROUTES } from "@/constants"
import { auth } from "@/lib/auth"
import { prisma } from "@/prisma/client"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function AnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
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

  const announcement = await prisma.announcement.findUnique({
    where: { id: id },
    include: {
      category: {
        select: {
          id: true,
          label: true,
        },
      },
      author: {
        select: {
          id: true,
          image: true,
          name: true,
          firstName: true,
          lastName: true,
        },
      },
      targetRegions: {
        select: {
          region: { select: { id: true, label: true } },
        },
      },
      targetSchools: {
        select: {
          school: { select: { id: true, label: true } },
        },
      },
      targetYearLevels: {
        select: {
          yearLevel: { select: { id: true, label: true } },
        },
      },
      interactions: {
        where: { userId: user.id },
        // select: { where: true },
      },
    },
  })

  if (!announcement) return

  return (
    <div>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <BackButton />
        <AnnouncementDetail
          userId={user.id}
          userRole={user.role}
          announcement={announcement}
          // userId={user.id}
          // userRole={user.role}
          // post={post}
          // viewCount={viewCount}
          // likeCount={likeCount}
        />
      </main>
    </div>
  )
}
