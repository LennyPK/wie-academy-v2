import Pagination from "@/components/pagination"
import { requireSession } from "@/lib/auth/session"
import { getPostCategories } from "@/lib/database"
import { Prisma } from "@/lib/generated/prisma/client"
import { prisma } from "@/lib/prisma/client"
import { Role } from "@/lib/prisma/enums"
import { Metadata } from "next"
import ForumEmpty from "./_components/empty"
import ForumFilters from "./_components/filters"
import ForumHeader from "./_components/header"
import ForumList from "./_components/list"

export const metadata: Metadata = {
  title: "Forum",
  description: "Connect, share, and learn with your peers",
}

interface SearchParams {
  query?: string
  category?: string

  page?: string
}

interface ForumPageProps {
  searchParams?: Promise<SearchParams>
}

export default async function ForumPage({ searchParams }: ForumPageProps) {
  const session = await requireSession()
  const user = session.user

  // Extract search params with defaults
  const params = await searchParams

  const query = params?.query?.trim() || ""
  const category = params?.category || "all"

  const currentPage = Number(params?.page) || 1
  const pageSize = 8

  const conditions: Prisma.PostWhereInput[] = []

  // Search Filter
  if (query) {
    conditions.push({
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { contentPlain: { contains: query, mode: "insensitive" } },
      ],
    })
  }

  // Category Filter
  if (category !== "all") {
    conditions.push({ categoryId: { equals: parseInt(category) } })
  }

  if (user.role !== Role.ADMIN) {
    conditions.push({ OR: [{ isPrivate: false }, { authorId: user.id }] })
  }

  const where: Prisma.PostWhereInput = conditions.length > 0 ? { AND: conditions } : {}

  const [posts, postCategories, count] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        category: { select: { id: true, label: true } },
        author: { select: { id: true, image: true, name: true, firstName: true, lastName: true } },
        interactions: true,
      },
      orderBy: { updatedAt: "desc" },
      take: pageSize,
      skip: (currentPage - 1) * pageSize,
    }),

    getPostCategories(),

    prisma.post.count({ where }),
  ])

  // Get the total number of pages
  const totalPages = Math.max(1, Math.ceil((count || 0) / pageSize))

  return (
    <div>
      <ForumHeader />

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        <ForumFilters
          categories={postCategories}
          totalCount={count}
          searchQuery={query}
          category={category}
        />

        {/* No posts found */}
        {posts && posts.length === 0 && <ForumEmpty />}

        <ForumList userId={user.id} userRole={user.role} posts={posts} />

        <Pagination totalPages={totalPages} />
      </main>
    </div>
  )
}
