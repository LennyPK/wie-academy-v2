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
import { ApprovalStatus } from "@/lib/prisma/enums"
import { AlertCircle, Clock, Home, Mail } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

interface SearchParams {
  email: string
}

interface ApprovalPageProps {
  searchParams?: Promise<SearchParams>
}

export default async function ApprovalPage({ searchParams }: ApprovalPageProps) {
  const params = await searchParams

  const email = params?.email || ""

  if (!email) {
    redirect(ROUTES.UNAUTHENTICATED_ERROR)
  }

  const user = await prisma.user.findUnique({ where: { email }, select: { approvalStatus: true } })

  if (!user) {
    redirect(ROUTES.UNAUTHENTICATED_ERROR)
  }

  if (user.approvalStatus === ApprovalStatus.APPROVED) {
    redirect(ROUTES.DASHBOARD)
  }

  if (user.approvalStatus === ApprovalStatus.DECLINED) {
    return (
      <main className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader className="space-y-2 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Application Declined</CardTitle>
              <CardDescription>
                We&apos;ve reviewed your application and are unable to approve it at this time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive" className="flex items-center justify-center">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="justify-items-center text-center">
                  Your application for <strong>{email}</strong> has been declined.
                </AlertDescription>
              </Alert>

              <p className="text-center text-sm text-balance text-muted-foreground">
                If you believe this is an error or have additional information to share, please
                reach out to our support team. We&apos;re here to help.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button asChild variant="default" className="w-full">
                <Link
                  href={`mailto:support@wieacademy.org?subject=Application%20Review%20Request&body=Please%20review%20my%20application%20for%20${encodeURIComponent(
                    email
                  )}`}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Support
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href={ROUTES.SIGN_UP}>Submit New Application</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Application Received!</CardTitle>
            <CardDescription>Your application is currently under review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription className="justify-items-center">
                We&apos;ll notify you via email at{" "}
                <strong className="text-foreground">{email}</strong> once a decision has been made.
              </AlertDescription>
            </Alert>

            <p className="text-center text-sm text-balance text-muted-foreground">
              Most applications are reviewed within{" "}
              <span className="whitespace-nowrap">24&nbsp;&ndash;&nbsp;72</span> hours. Thank you
              for your patience!
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button asChild variant="default" className="w-full">
              <Link
                href={`mailto:support@wieacademy.org?subject=Application%20Inquiry&body=Hi,%20I%20need%20help%20with%20my%20application%20for%20${encodeURIComponent(
                  email
                )}`}
              >
                <Mail className="mr-2 h-4 w-4" />
                Contact Support
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link
                href={ROUTES.HOME}
                className="flex items-center justify-center gap-2 align-middle"
              >
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
