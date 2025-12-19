import { getRegions, getSchools, getYearLevels } from "@/db"
import SignUpForm from "./_components/form"

export default async function SignUpPage() {
  const regions = await getRegions()
  const yearLevels = await getYearLevels()
  const schools = await getSchools()

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <SignUpForm regions={regions} yearLevels={yearLevels} schools={schools} />
      </div>
    </main>
  )
}
