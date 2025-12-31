import MenuBar from "@/components/header/menu-bar"
import { auth } from "@/lib/auth"
import { ROUTES } from "@/lib/constants"
import { prisma } from "@/lib/prisma/client"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect(ROUTES.UNAUTHENTICATED_ERROR)
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      image: true,
      role: true,
    },
  })

  if (!user) {
    redirect(ROUTES.UNAUTHENTICATED_ERROR)
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="flex w-full flex-1 flex-col items-center">
        <header className="sticky top-0 z-50 flex w-full justify-center border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
          <MenuBar user={user} />
        </header>
        <div className="flex w-full flex-1 flex-col">{children}</div>
      </div>
    </main>
  )
}
