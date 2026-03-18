import AnnouncementForm from "@/announcements/_components/form"
import BackButton from "@/components/back-button"
import { prisma } from "@/prisma/client"
import { notFound } from "next/navigation"

export default async function AnnouncementEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const announcement = await prisma.announcement.findUnique({
    where: { id: id },
    include: {
      category: {
        select: { id: true, label: true },
      },
      author: {
        select: { id: true, image: true, name: true, firstName: true, lastName: true },
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
      interactions: { where: { announcementId: "__never__" } },
    },
  })

  if (!announcement) notFound()

  return (
    <div>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <BackButton />
        <AnnouncementForm announcement={announcement} />
      </main>
    </div>
  )
}
