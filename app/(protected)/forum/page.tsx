import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { auth } from "@/lib/auth"
import { ROUTES } from "@/lib/constants"
import { getPostCategories } from "@/lib/database"
import { Prisma } from "@/lib/generated/prisma/client"
import { prisma } from "@/lib/prisma/client"
import { Role } from "@/lib/prisma/enums"
import { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import BackButton from "./_components/back-button"
import ForumContent from "./_components/content"
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

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true },
  })

  if (!user) {
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
    <>
      <div className="hidden sm:block">
        <ForumHeader />

        <main className="mx-auto max-w-6xl space-y-8 px-6 py-8">
          <ForumFilters
            categories={postCategories}
            totalCount={count}
            searchQuery={query}
            category={category}
          />

          <ResizablePanelGroup direction="horizontal" className="gap-5">
            <ResizablePanel defaultSize={40} minSize={35} maxSize={50}>
              <ForumList userId={user.id} posts={posts} totalPages={totalPages} />
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel defaultSize={60}>
              <ForumContent userId={user.id} userRole={user.role} mode={mode} post={selectedPost} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>
      </div>

      <div className="sm:hidden">
        {selectedPost || !!mode ? (
          <div className="px-4">
            <BackButton />

            <ForumContent userId={user.id} userRole={user.role} mode={mode} post={selectedPost} />
          </div>
        ) : (
          <>
            <ForumHeader />

            <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
              <ForumFilters
                categories={postCategories}
                totalCount={count}
                searchQuery={query}
                category={category}
              />

              <ForumList userId={user.id} posts={posts} totalPages={totalPages} />
            </main>
          </>
        )}
      </div>
    </>
  )
}
