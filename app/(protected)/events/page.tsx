import Pagination from "@/components/pagination"
import { auth } from "@/lib/auth"
import { ROUTES } from "@/lib/constants"
import { getEventCategories } from "@/lib/database"
import { Prisma } from "@/lib/generated/prisma/client"
import { prisma } from "@/lib/prisma/client"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import EventEmpty from "./_components/empty"
import EventFilters from "./_components/filters"
import EventHeader from "./_components/header"

interface SearchParams {
  query?: string
  status?: "upcoming" | "ongoing" | "completed"
  category?: string
  sorting?: "date_asc" | "date_desc"

  page?: string
}

interface EventPageProps {
  searchParams?: Promise<SearchParams>
}

export default async function EventPage({ searchParams }: EventPageProps) {
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
  const status = params?.status || "upcoming"
  const category = params?.category || "all"
  const sorting = params?.sorting || "date_desc"

  const currentPage = Number(params?.page) || 1
  const pageSize = 5

  const where: Prisma.EventWhereInput = {}

  // Search Filter
  // if (query) {
  //   // Using OR at the top level so other filters (date, targeting, read status) are ANDed
  //   where.OR = [
  //     { title: { contains: query, mode: "insensitive" } },
  //     { contentPlain: { contains: query, mode: "insensitive" } },
  //   ]
  // }

  const [events, eventCategories, count] = await Promise.all([
    prisma.event.findMany({
      where,
      include: {
        category: { select: { id: true, value: true, label: true } },
        // author: { select: { name: true, image: true } },
        // interactions: {
        //   where: { userId: user.id },
        //   select: { isRead: true },
        // },
        // targetRegions: { select: { regionId: true } },
        // targetSchools: { select: { schoolId: true } },
        // targetYearLevels: { select: { yearLevelId: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: pageSize,
      skip: (currentPage - 1) * pageSize,
    }),

    getEventCategories(),

    prisma.event.count({ where }),
  ])

  // Get the total number of pages
  const totalPages = Math.max(1, Math.ceil((count || 0) / pageSize))

  return (
    <div>
      <EventHeader userRole={user.role} />

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        <EventFilters
          categories={eventCategories}
          searchQuery={query}
          status={status}
          category={category}
          sorting={sorting}
          totalCount={count}
        />

        {/* No events found */}
        {events && events.length === 0 && <EventEmpty />}

        <Pagination totalPages={totalPages} />
      </main>
    </div>
  )
}
