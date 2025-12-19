import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ROUTES } from "@/lib/constants"
import { prisma } from "@/lib/prisma/client"
import { Mail } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import VerifyForm from "./_components/form"

// interface SearchParams {
//   email: string
// }

// interface VerifyPageProps {
//   searchParams?: Promise<SearchParams>
// }

interface VerifyPageProps {
  // searchParams?: Promise<SearchParams>
  searchParams?: {
    email?: string
  }
}

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  // FIXME: Email param needs to be replacecd with a token param
  const params = await searchParams

  const email = params?.email || ""

  if (!email) {
    // redirect(ROUTES.UNAUTHENTICATED_ERROR)
    console.error("No email provided.")
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, emailVerified: true },
  })

  if (!user) {
    // redirect(ROUTES.UNAUTHENTICATED_ERROR)
    console.error("User not found.")
    return <div>No User</div>
  }

  if (user.emailVerified) {
    console.log("Email already verified, redirecting to pending approval.")
    redirect(`${ROUTES.PENDING_APPROVAL}?email=${email}`)
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Card>
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Verify Your Email</CardTitle>
            <CardDescription>We&apos;ve sent a verification link to your inbox</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="items-center">
              <Mail className="h-4 w-4" />
              <AlertDescription className="text-center">
                Check your email and click the verification link to activate your account.
              </AlertDescription>
            </Alert>

            <div className="space-y-2 rounded-lg bg-muted p-4">
              <p className="text-sm font-medium">Didn&apos;t receive the email?</p>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li>Check your spam or junk folder</li>
                <li>Make sure the email address is correct</li>
                <li>Wait a few minutes and refresh your inbox</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <VerifyForm email={email} />

            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href={ROUTES.HOME}>Back to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
