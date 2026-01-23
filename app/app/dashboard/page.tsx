import { ROUTES } from "@/constants"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect(ROUTES.SIGN_IN)
  }

  return <h1>Welcome {session.user.name}</h1>
}
