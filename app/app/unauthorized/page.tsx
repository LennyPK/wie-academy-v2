import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { ROUTES } from "@/constants"
import { requireSession } from "@/lib/auth/session"
import { HomeIcon, Mail } from "lucide-react"
import Link from "next/link"

export default async function UnauthorizedPage() {
  const session = await requireSession()
  const email = session.user.email

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      <Empty>
        <EmptyHeader>
          <EmptyTitle className="mask-b-from-20% mask-b-to-80% text-9xl font-extrabold text-primary">
            403
          </EmptyTitle>
          <EmptyDescription className="-mt-8 text-nowrap text-foreground/80">
            You don&apos;t have permission to view this page
            <br />
            Please contact support if you think this is a mistake
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={ROUTES.DASHBOARD}>
                <HomeIcon className="mr-2 size-4" data-icon="inline-start" />
                Go Home
              </Link>
            </Button>

            <Button asChild variant="default">
              <Link
                href={`mailto:${process.env.EMAIL_SUPPORT_ADDRESS}?subject=Application%20Review%20Request&body=Please%20review%20my%20application%20for%20${encodeURIComponent(
                  email
                )}`}
              >
                <Mail className="mr-2 h-4 w-4" />
                Contact Support
              </Link>
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  )
}
