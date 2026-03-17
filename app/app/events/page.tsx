import Pagination from "@/components/pagination"
import { requireSession } from "@/lib/auth/session"
import { getEventCategories } from "@/lib/database"
import { Prisma } from "@/lib/generated/prisma/client"
import { prisma } from "@/lib/prisma/client"
import { Metadata } from "next"
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
  const session = await requireSession()
  const user = session.user

  // Extract search params with defaults
  const params = await searchParams

  const query = params?.query?.trim() || ""
  const status = params?.status || "upcoming"
  const category = params?.category || "all"

  const defaultSorting = status === "completed" ? "date_desc" : "date_asc"
  const sorting = params?.sorting || defaultSorting

  const currentPage = Number(params?.page) || 1
  const pageSize = 6

  const conditions: Prisma.EventWhereInput[] = []

  // Search Filter
  if (query) {
    conditions.push({
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { descriptionPlain: { contains: query, mode: "insensitive" } },
      ],
    })
  }

  // Status Filter
  const now = new Date()

  switch (status) {
    case "upcoming":
      conditions.push({ startDateTime: { gt: now } })
      break
    case "ongoing":
      conditions.push({ AND: [{ startDateTime: { lte: now } }, { endDateTime: { gte: now } }] })
      break
    case "completed":
      conditions.push({ endDateTime: { lt: now } })
      break
  }

  // Category Filter
  if (category !== "all") {
    conditions.push({ categoryId: { equals: parseInt(category) } })
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

  const where: Prisma.EventWhereInput = conditions.length > 0 ? { AND: conditions } : {}

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
