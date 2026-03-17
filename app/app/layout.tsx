import MenuBar from "@/components/header/menu-bar"
import { requireSession } from "@/lib/auth/session"
import { ROUTES } from "@/lib/constants"
import { prisma } from "@/lib/prisma/client"
import { redirect } from "next/navigation"

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession()

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
    redirect(ROUTES.SIGN_IN)
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
