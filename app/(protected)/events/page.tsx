import Pagination from "@/components/pagination"
import { auth } from "@/lib/auth"
import { ROUTES } from "@/lib/constants"
import { getEventCategories } from "@/lib/database"
import { Prisma } from "@/lib/generated/prisma/client"
import { prisma } from "@/lib/prisma/client"
import { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import EventEmpty from "./_components/empty"
import EventFilters from "./_components/filters"
import EventHeader from "./_components/header"
import EventList from "./_components/list"

export const metadata: Metadata = {
  title: "Events",
  description: "Explore upcoming events and get involved in what's happening around you.",
}

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

  const defaultSorting = status === "completed" ? "date_desc" : "date_asc"
  const sorting = params?.sorting || defaultSorting

  const currentPage = Number(params?.page) || 1
  const pageSize = 6

  const where: Prisma.EventWhereInput = {}

  // Search Filter
  if (query) {
    // Using OR at the top level so other filters (date, targeting, read status) are ANDed
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { descriptionPlain: { contains: query, mode: "insensitive" } },
    ]
  }

  // Status Filter
  const now = new Date()

  switch (status) {
    case "upcoming":
      where.startDateTime = { gt: now }
      break
    case "ongoing":
      where.AND = [{ startDateTime: { lte: now } }, { endDateTime: { gte: now } }]
      break
    case "completed":
      where.endDateTime = { lt: now }
      break
  }

  // Category Filter
  if (category !== "all") {
    where.categoryId = { equals: parseInt(category) }
  }

  // Sorting Filter
  let orderBy: Prisma.EventOrderByWithRelationInput

  switch (sorting) {
    case "date_asc":
      orderBy = { startDateTime: "asc" }
      break
    case "date_desc":
    default:
      orderBy = { startDateTime: "desc" }
      break
  }

  const [events, eventCategories, count] = await Promise.all([
    prisma.event.findMany({
      where,
      include: {
        category: { select: { id: true, label: true } },
        registrations: {
          where: { userId: user.id },
          select: { userId: true },
        },
        participations: {
          where: { userId: user.id },
          select: { userId: true },
        },
        _count: {
          select: {
            registrations: true,
            participations: true,
          },
        },
      },
      orderBy: orderBy,
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
          totalCount={count}
          searchQuery={query}
          status={status}
          category={category}
          sorting={sorting}
        />

        {/* No events found */}
        {events && events.length === 0 && <EventEmpty />}

        <EventList userId={user.id} userRole={user.role} events={events} searchQuery={query} />

        <Pagination totalPages={totalPages} />
      </main>
    </div>
  )
}
