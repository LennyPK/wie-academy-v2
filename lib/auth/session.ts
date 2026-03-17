import { auth } from "@/lib/auth"
import { ROUTES } from "@/lib/constants"
import { Role } from "@/prisma/enums"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect(ROUTES.SIGN_IN)
  }

  return { ...session, user: session.user as typeof session.user & { role: Role } }
}
