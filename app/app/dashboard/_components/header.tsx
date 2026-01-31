interface DashboardHeaderProps {
  userId: string
  userFirstName: string
  userLastName: string
}

export default function DashboardHeader({ userFirstName }: DashboardHeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-6 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <div className="text-center sm:text-start">
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {userFirstName}!</h1>
          <p className="mt-1 text-sm text-muted-foreground">Ready to continue your journey?</p>
        </div>

        <div className="flex w-full flex-col items-center rounded-md bg-linear-to-r from-primary/80 to-secondary px-3 py-2 sm:w-auto sm:min-w-50 sm:items-end">
          <span className="text-sm font-semibold text-primary">Level 0</span>
          <p className="text-xs text-foreground">Level Name</p>
        </div>
      </div>
    </header>
  )
}
