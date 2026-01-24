import { auth } from "@/lib/auth"
import { ROUTES } from "@/lib/constants"
import { prisma } from "@/lib/prisma/client"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import ExploreHeader from "./_components/header"

export const metadata: Metadata = {
  title: "Explore",
  description: "Discover new content and experiences tailored for you.",
}

export default async function ExplorePage() {
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

  return (
    <div>
      <ExploreHeader />
    </div>
  )
}
