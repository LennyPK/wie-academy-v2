import AnnouncementDetail from "@/announcements/_components/detail"
import BackButton from "@/components/back-button"
import { requireSession } from "@/lib/auth/session"
import { prisma } from "@/prisma/client"

export default async function AnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession()
  const user = session.user

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
