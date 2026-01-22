import BackButton from "@/components/back-button"
import { ROUTES } from "@/lib/constants"
import { Metadata } from "next"
import SignInForm from "./_components/form"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Academy account to continue.",
}

export default function SignInPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col">
        <BackButton label="Home" route={ROUTES.HOME} />
        <SignInForm />
      </div>
    </main>
  )
}
