import Pagination from "@/components/pagination"
import { auth } from "@/lib/auth"
import { ROUTES } from "@/lib/constants"
import { Prisma } from "@/lib/generated/prisma/client"
import { prisma } from "@/lib/prisma/client"
import { Role } from "@/prisma/enums"
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

interface AnnouncementPageProps {
  searchParams?: Promise<SearchParams>
}

export default async function AnnouncementPage({ searchParams }: AnnouncementPageProps) {
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

  // FIXME: OR is intentionally only set once.
  // If you add another OR-based filter, refactor to AND[] composition.
  const where: Prisma.AnnouncementWhereInput = {}

  // Search Filter
  if (query) {
    // Using OR at the top level so other filters (date, targeting, read status) are ANDed
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { contentPlain: { contains: query, mode: "insensitive" } },
    ]
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

    where.updatedAt = { gte }
  }

  // Read Status Filter
  if (readStatus !== "all") {
    const isRead = readStatus === "read"

    if (isRead) {
      where.interactions = { some: { userId: user.id, isRead: true } }
    } else {
      where.interactions = { none: { userId: user.id, isRead: true } }
    }
  }

  // Targeting
  // TODO: Fix targeting logic
  if (user.role === Role.MEMBER) {
    //   const orConditions: Prisma.AnnouncementWhereInput[] = []
    // if (user.region) {
    //   where.targetRegions = { some: { region: user.region } }
    //   //     orConditions.push({ targetRegions: { some: { regionId: user.region.id } } })
    // }
    // if (user.school) {
    //   where.targetSchools = { some: { school: user.school } }
    //   //     orConditions.push({ targetSchools: { some: { school: user.school } } })
    // }
    // if (user.yearLevel) {
    //   where.targetYearLevels = { some: { yearLevel: user.yearLevel } }
    // }
    //   if (orConditions.length > 0) {
    //     whereConditions.push({ OR: orConditions })
    //   }
    //   // where.AND = [
    //   //   {
    //   //     OR: [{ targetSchools: { isEmpty: true } }, { targetSchools: { has: user.school } }],
    //   //   },
    //   //   {
    //   //     OR: [{ targetRegions: { isEmpty: true } }, { targetRegions: { has: user.region.id } }],
    //   //   },
    //   //   {
    //   //     OR: [{ targetYears: { isEmpty: true } }, { targetYears: { has: user.yearLevel.id } }],
    //   //   },
    //   // ]
  }

  const [announcements, count] = await Promise.all([
    prisma.announcement.findMany({
      where,
      include: {
        category: { select: { id: true, label: true } },
        author: { select: { name: true, image: true } },
        interactions: {
          where: { userId: user.id },
          select: { isRead: true },
        },
        targetRegions: { select: { regionId: true } },
        targetSchools: { select: { schoolId: true } },
        targetYearLevels: { select: { yearLevelId: true } },
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
          // onToggleRead={}
          // onMarkSeen={}
          searchQuery={query}
        />

        {/* Pagination */}
        <Pagination totalPages={totalPages} />
      </main>
    </div>
  )
}
