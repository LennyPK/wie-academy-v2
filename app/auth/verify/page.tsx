import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SearchParams {
  email: string
}

interface VerifyPageProps {
  searchParams?: Promise<SearchParams>
}

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const params = await searchParams

  const email = params?.email || ""

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {/* <SignUpCard regions={regions} yearLevels={yearLevels} schools={schools} /> */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Verify Your Account</CardTitle>
          </CardHeader>
          <CardContent>
            <Input value={email} />
          </CardContent>
        </Card>
        <div className={cn("flex flex-col gap-6")}></div>
      </div>
    </main>
  )
}
