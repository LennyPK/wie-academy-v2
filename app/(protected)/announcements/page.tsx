import { auth } from "@/lib/auth"
import { ROUTES } from "@/lib/constants"
import { Prisma } from "@/lib/generated/prisma/client"
import { prisma } from "@/lib/prisma/client"
import { Role } from "@/prisma/enums"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import AnnouncementList from "./_components/_announcement-list"
import AnnouncementEmpty from "./_components/announcement-empty"
import Filters from "./_components/filters"
import { AnnouncementHeader } from "./_components/header"
import Pagination from "./_components/pagination"

interface SearchParams {
  searchQuery?: string
  readStatus?: "all" | "read" | "unread"
  dateRange?: "all" | "today" | "week" | "month" | "year"
  page?: string
}

export default async function AnnouncementsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect(ROUTES.UNAUTHENTICATED_ERROR)
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      role: true,
      school: true,
      region: { select: { id: true, label: true } },
      yearLevel: { select: { id: true, label: true } },
    },
  })

  if (!user) {
    redirect(ROUTES.UNAUTHENTICATED_ERROR)
  }

  // Extract search params with defaults
  const {
    searchQuery: searchQueryParam,
    readStatus: readStatusParam,
    dateRange: dateFilterParam,
    page: pageParam,
  } = await searchParams

  const searchQuery = searchQueryParam?.trim() || ""
  const readStatus = readStatusParam || "all"
  const dateRange = dateFilterParam || "month"
  const page = Number(pageParam) || 1
  const pageSize = 2

  const whereConditions: Prisma.AnnouncementWhereInput["AND"] = []

  // Search Filter
  if (searchQuery) {
    whereConditions.push({
      OR: [
        { title: { contains: searchQuery, mode: "insensitive" } },
        { contentPlain: { contains: searchQuery, mode: "insensitive" } },
      ],
    })
  }

  // Date Filter
  if (dateRange !== "all") {
    const now = new Date()
    let gte: Date

    switch (dateRange) {
      case "today":
        gte = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case "week":
        gte = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "month":
        gte = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "year":
        gte = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        gte = new Date(0)
    }

    // const ranges: Record<string, () => Date> = {
    //   today: () => new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    //   week: () => new Date(now.getTime() - 7 * 86400000),
    //   month: () => new Date(now.getTime() - 30 * 86400000),
    //   year: () => new Date(now.getTime() - 365 * 86400000),
    // }

    // const dateFn = ranges[dateRange]
    // if (dateFn) {
    //   where.updatedAt = { gte: dateFn() }
    // }
    whereConditions.push({ updatedAt: { gte } })
  }

  // Read Status Filter
  if (readStatus !== "all") {
    const isRead = readStatus === "read"

    if (isRead) {
      whereConditions.push({
        interactions: { some: { userId: user.id, isRead } },
      })
    } else {
      whereConditions.push({
        interactions: { none: { userId: user.id, isRead } },
      })
    }

    whereConditions.push({ interactions: { some: { userId: user.id, isRead } } })
  }

  // if (readStatus === "unread") {
  //   whereConditions.push({
  //     NOT: {
  //       interactions: { some: { userId: user.id, isRead: true } },
  //     },
  //   })
  // }

  // Targeting
  if (user.role === Role.MEMBER) {
    const orConditions: Prisma.AnnouncementWhereInput[] = []

    if (user.school) {
      orConditions.push({ targetSchools: { some: { school: user.school } } })
    }

    if (user.region && user.region.id) {
      orConditions.push({ targetRegions: { some: { regionId: user.region.id } } })
    }

    if (orConditions.length > 0) {
      whereConditions.push({ OR: orConditions })
    }

    // where.AND = [
    //   {
    //     OR: [{ targetSchools: { isEmpty: true } }, { targetSchools: { has: user.school } }],
    //   },
    //   {
    //     OR: [{ targetRegions: { isEmpty: true } }, { targetRegions: { has: user.region.id } }],
    //   },
    //   {
    //     OR: [{ targetYears: { isEmpty: true } }, { targetYears: { has: user.yearLevel.id } }],
    //   },
    // ]
  }

  const [announcements, count] = await Promise.all([
    prisma.announcement.findMany({
      // where: { AND: whereConditions },
      include: {
        category: { select: { id: true, value: true, label: true } },
        author: { select: { name: true, image: true } },
        interactions: {
          where: { userId: user.id },
          select: { isRead: true },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: pageSize,
      skip: (page - 1) * pageSize,
    }),

    prisma.announcement.count({ where: { AND: whereConditions } }),
  ])

  // Get the total number of pages
  const totalPages = Math.max(1, Math.ceil((count || 0) / pageSize))

  console.log("Announcements:", announcements)
  console.log("Count:", count)
  console.log("Total Pages:", totalPages)
  console.log("Page:", page)

  return (
    <div>
      <AnnouncementHeader />

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        <Filters
          // userRole={user.role}
          search={searchQuery}
          readStatus={readStatus}
          dateRange={dateRange}
          totalCount={count ?? announcements?.length ?? 0}
        />

        {/* No announcements found */}
        {announcements && announcements.length === 0 && <AnnouncementEmpty />}

        <AnnouncementList
          userId={user.id}
          userRole={user.role}
          announcements={announcements}
          // readAnnouncements={}
          // onToggleRead={}
          // onMarkSeen={}
          searchQuery={searchQuery}
        />

        {/* Pagination */}
        <Pagination totalPages={totalPages} />
      </main>
    </div>
  )
}
