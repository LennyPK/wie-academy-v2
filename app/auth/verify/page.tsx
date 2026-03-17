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
import { ROUTES } from "@/constants"
import { auth } from "@/lib/auth"
import { Mail } from "lucide-react"
import { cookies, headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import VerifyForm from "./_components/form"

export default async function VerifyPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const cookieStore = await cookies()
  const pendingEmail = cookieStore.get("pending_email")?.value

  if (!session && !pendingEmail) {
    redirect(ROUTES.SIGN_IN)
  }

  if (session?.user.emailVerified) {
    redirect(ROUTES.APPROVAL)
  }

  const email = session?.user.email ?? pendingEmail

  if (!email) {
    redirect(ROUTES.SIGN_IN)
  }

  /* FIXME: Cleaner solution if BetterAuth has a built in method to create a session when
      user signs in/up with requireEmailVerification turned on */
  // if (!session) {
  //   redirect(ROUTES.UNAUTHENTICATED_ERROR)
  // }

  // if (session.user.emailVerified) {
  //   redirect(ROUTES.APPROVAL)
  // }

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
