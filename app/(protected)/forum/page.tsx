import { ResizableHandle, ResizablePanelGroup } from "@/components/ui/resizable"
import { auth } from "@/lib/auth"
import { ROUTES } from "@/lib/constants"
import { getPostCategories } from "@/lib/database"
import { Prisma } from "@/lib/generated/prisma/client"
import { prisma } from "@/lib/prisma/client"
import { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import ForumFilters from "./_components/filters"
import ForumHeader from "./_components/header"
import ForumPanelContent from "./_components/panel-content"
import ForumPanelList from "./_components/panel-list"

export const metadata: Metadata = {
  title: "Forum",
  description: "Connect, share, and learn with your peers",
}

interface SearchParams {
  query?: string
  category?: string

  page?: string

  postId?: string
  mode?: "create" | "edit"
}

interface ForumPageProps {
  searchParams?: Promise<SearchParams>
}

export default async function ForumPage({ searchParams }: ForumPageProps) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect(ROUTES.UNAUTHENTICATED_ERROR)
  }

  // Extract search params with defaults
  const params = await searchParams

  const query = params?.query?.trim() || ""
  const category = params?.category || "all"

  const currentPage = Number(params?.page) || 1
  const pageSize = 6

  const postId = params?.postId
  const mode = params?.mode

  const where: Prisma.PostWhereInput = {}

  // Search Filter
  if (query) {
    // Using OR at the top level so other filters (date, targeting, read status) are ANDed
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { contentPlain: { contains: query, mode: "insensitive" } },
    ]
  }

  // Category Filter
  if (category !== "all") {
    where.categoryId = { equals: parseInt(category) }
  }

  const [posts, postCategories, count] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        category: { select: { id: true, label: true } },
        author: { select: { image: true, name: true } },
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

  const selectedPost = posts.find((post) => post.id === postId)

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

        <ResizablePanelGroup direction="horizontal" className="gap-5">
          <ForumPanelList
            defaultSize={40}
            minSize={20}
            maxSize={50}
            posts={posts}
            totalPages={totalPages}
          />

          <ResizableHandle />

          <ForumPanelContent mode={mode} post={selectedPost} />
        </ResizablePanelGroup>
      </main>
    </div>
  )
}
