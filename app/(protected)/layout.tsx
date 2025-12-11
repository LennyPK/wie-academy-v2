// import MenuBar from "@/components/header/menu-bar"
// import { getUser } from "@/lib/database/user/server"

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  // const user = await getUser()

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="flex w-full flex-1 flex-col items-center">
        <header className="sticky top-0 z-50 flex w-full justify-center border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
          {/* <MenuBar user={user} /> */}
          <h1>Hello World</h1>
        </header>
        <div className="flex w-full flex-1 flex-col">{children}</div>
      </div>
    </main>
  )
}
