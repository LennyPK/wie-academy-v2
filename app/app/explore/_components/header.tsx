"use client"

// interface ExploreHeaderProps {
//   userRole: Role
// }

// export default function ExploreHeader({ userRole }: ExploreHeaderProps) {
export default function ExploreHeader() {
  // const [open, setOpen] = useState(false)

  // const handleCreateClick = () => {
  //   setOpen(true)
  // }

  return (
    <>
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Explore</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Discover new content and experiences tailored for you.
            </p>
          </div>
          {/* {userRole === Role.ADMIN && (
            <Button className="gap-2" onClick={handleCreateClick}>
              <Plus />
              <span className="hidden sm:inline">Create Event</span>
              <span className="sm:hidden">Create</span>
            </Button>
          )} */}
        </div>
      </header>

      {/* <EventFormModal open={open} setOpen={setOpen} /> */}
    </>
  )
}
