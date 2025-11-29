import { getRegions, getYearLevels } from "@/lib/auth/actions"
import SignUpCard from "./_components/form"

export default async function SignUpPage() {
  const regions = await getRegions()
  const yearLevels = await getYearLevels()

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <SignUpCard regions={regions} yearLevels={yearLevels} />
      </div>
    </main>
  )
}
