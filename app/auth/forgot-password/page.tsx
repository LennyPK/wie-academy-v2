import BackButton from "@/components/back-button"
import ForgotPasswordForm from "./_components/form"

export default async function ForgotPasswordPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col">
        <BackButton />
        <ForgotPasswordForm />
      </div>
    </main>
  )
}
