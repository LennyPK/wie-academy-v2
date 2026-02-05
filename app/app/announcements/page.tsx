import Pagination from "@/components/pagination"
import { auth } from "@/lib/auth"
import { ROUTES } from "@/lib/constants"
import { Prisma } from "@/lib/generated/prisma/client"
import { prisma } from "@/lib/prisma/client"
import { AnnouncementInteractionType, Role } from "@/prisma/enums"
import { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import AnnouncementEmpty from "./_components/empty"
import AnnouncementFilters from "./_components/filters"
import AnnouncementHeader from "./_components/header"
import AnnouncementList from "./_components/list"

export const metadata: Metadata = {
  title: "Announcements",
  description: "Stay updated with the latest news.",
}

interface SearchParams {
  query?: string
  readStatus?: "all" | "read" | "unread"
  dateRange?: "all" | "today" | "30_days" | "week" | "month" | "year"
  page?: string
}

interface AnnouncementsPageProps {
  searchParams?: Promise<SearchParams>
}

export default async function AnnouncementsPage({ searchParams }: AnnouncementsPageProps) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect(ROUTES.UNAUTHENTICATED_ERROR)
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      role: true,
      school: { select: { id: true, label: true } },
      region: { select: { id: true, label: true } },
      yearLevel: { select: { id: true, label: true } },
    },
  })

  if (!user) {
    redirect(ROUTES.UNAUTHENTICATED_ERROR)
  }

  // Extract search params with defaults
  const params = await searchParams

  const query = params?.query?.trim() || ""
  const readStatus = params?.readStatus || "all"
  const dateRange = params?.dateRange || "30_days"

  const currentPage = Number(params?.page) || 1
  const pageSize = 5

  const conditions: Prisma.AnnouncementWhereInput[] = []

  // Search Filter
  if (query) {
    conditions.push({
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { contentPlain: { contains: query, mode: "insensitive" } },
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
        const day = now.getDay()
        gte = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day)
        break
      case "month":
        gte = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case "year":
        gte = new Date(now.getFullYear(), 0, 1)
        break
      case "30_days":
      default:
        gte = new Date(now)
        gte.setDate(gte.getDate() - 30)
        break
    }

    conditions.push({ updatedAt: { gte } })
  }

  // Read Status Filter
  if (readStatus !== "all") {
    const isRead = readStatus === "read"

    if (isRead) {
      conditions.push({
        interactions: { some: { userId: user.id, type: AnnouncementInteractionType.VIEW } },
      })
    } else {
      conditions.push({
        interactions: { none: { userId: user.id, type: AnnouncementInteractionType.VIEW } },
      })
    }
  }

  // Targeting
  if (user.role === Role.MEMBER) {
    const targetingConditions: Prisma.AnnouncementWhereInput[] = []

    // Regions
    if (user.region) {
      targetingConditions.push({
        OR: [
          // Announcement has no region targeting => visible to all
          { targetRegions: { none: {} } },

          // Announcement targets user's region
          { targetRegions: { some: { regionId: user.region.id } } },
        ],
      })
    } else {
      // User has no region → only announcements with no region targeting
      targetingConditions.push({
        targetRegions: { none: {} },
      })
    }

    // Schools
    if (user.school) {
      targetingConditions.push({
        OR: [
          { targetSchools: { none: {} } },
          { targetSchools: { some: { schoolId: user.school.id } } },
        ],
      })
    } else {
      targetingConditions.push({
        targetSchools: { none: {} },
      })
    }

    // Year Levels
    if (user.yearLevel) {
      targetingConditions.push({
        OR: [
          { targetYearLevels: { none: {} } },
          { targetYearLevels: { some: { yearLevelId: user.yearLevel.id } } },
        ],
      })
    } else {
      targetingConditions.push({
        targetYearLevels: { none: {} },
      })
    }

    conditions.push({ AND: targetingConditions })
  }

  const where: Prisma.AnnouncementWhereInput = conditions.length > 0 ? { AND: conditions } : {}

  const [announcements, count] = await Promise.all([
    prisma.announcement.findMany({
      where,
      include: {
        category: { select: { id: true, label: true } },
        author: { select: { name: true, image: true } },
        interactions: {
          where: { userId: user.id },
          // select: { isRead: true },
        },
        targetRegions: { select: { region: { select: { id: true, label: true } } } },
        targetSchools: { select: { school: { select: { id: true, label: true } } } },
        targetYearLevels: { select: { yearLevel: { select: { id: true, label: true } } } },
      },
      orderBy: { updatedAt: "desc" },
      take: pageSize,
      skip: (currentPage - 1) * pageSize,
    }),

    prisma.announcement.count({ where }),
  ])

  // Get the total number of pages
  const totalPages = Math.max(1, Math.ceil((count || 0) / pageSize))

  return (
    <div>
      <AnnouncementHeader userRole={user.role} />

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        <AnnouncementFilters
          totalCount={count}
          searchQuery={query}
          readStatus={readStatus}
          dateRange={dateRange}
        />

        {/* No announcements found */}
        {announcements && announcements.length === 0 && <AnnouncementEmpty />}

        <AnnouncementList
          userId={user.id}
          userRole={user.role}
          announcements={announcements}
          searchQuery={query}
        />

        {/* Pagination */}
        <Pagination totalPages={totalPages} />
      </main>
    </div>
  )
}
