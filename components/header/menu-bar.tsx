"use client"

import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth/client"
import { ROUTES } from "@/lib/constants"
import { Role } from "@/lib/prisma/enums"
import { BookOpen, Calendar, Home, Megaphone, MessagesSquare, User as UserIcon } from "lucide-react"
import NextImage from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { createPortal } from "react-dom"
import DesktopHeader from "./desktop-header"
import MobileSidebar from "./mobile-sidebar"
import ProfileDropdown from "./profile-dropdown"
import { NavItem, User } from "./types"

interface MenuBarProps {
  user: User
}

export default function MenuBar({ user }: MenuBarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const navItems: NavItem[] = [
    { href: ROUTES.DASHBOARD, icon: Home, label: "Dashboard", surfaces: ["mobile"] },
    {
      href: ROUTES.ANNOUNCEMENTS,
      icon: Megaphone,
      label: "Announcements",
      surfaces: ["mobile", "desktop"],
    },
    { href: ROUTES.EVENTS, icon: Calendar, label: "Events", surfaces: ["mobile", "desktop"] },
    { href: ROUTES.FORUM, icon: MessagesSquare, label: "Forum", surfaces: ["mobile", "desktop"] },
    { href: ROUTES.LEARN, icon: BookOpen, label: "Learn", surfaces: ["mobile", "desktop"] },
  ]

  const accountItems: NavItem[] = [
    { href: ROUTES.DASHBOARD, icon: Home, label: "Dashboard", surfaces: ["desktop"] },
    {
      href: ROUTES.PROFILE,
      icon: UserIcon,
      label: "Profile",
      surfaces: ["mobile", "desktop"],
      allow: (user: User) => user.role !== Role.ADMIN,
    },

    // {
    //   href: routes.SETTINGS,
    //   label: "Settings",
    //   icon: Settings,
    // },
  ]

  const handleNavClick = () => {
    setSidebarOpen(false)
    setDropdownOpen(false)
  }

  const handleSignOut = () => {
    startTransition(async () => {
      // const supabase = createClient()
      // await supabase.auth.signOut()
      await authClient.signOut()
      router.push(ROUTES.SIGN_IN)
    })
  }

  // Add null checks to prevent errors during signout
  if (!user) return null

  return (
    <>
      {isPending &&
        createPortal(
          <div className="fixed inset-0 z-60 grid h-full w-full place-items-center backdrop-blur-sm">
            <div className="flex items-center gap-2 rounded-md bg-card px-8 py-4 shadow">
              <Spinner />
              <span className="text-sm text-foreground">Signing you out...</span>
            </div>
          </div>,
          document.body
        )}

      <div className="flex w-full max-w-6xl items-center justify-between px-5 py-3 text-sm">
        {/* LEFT SIDE CONTAINER: Contains logo and navigation links */}
        <div className="flex items-center gap-5 font-semibold">
          {/* LOGO SECTION */}
          <Link href={ROUTES.DASHBOARD} className="flex items-center space-x-2">
            <NextImage
              src="/logo.svg"
              alt="Women in Engineering Academy Logo"
              width={50}
              height={50}
              priority
            />
          </Link>

          {/* DESKTOP NAVIGATION: Show on large screens */}
          <DesktopHeader navItems={navItems} pathname={pathname} className="hidden sm:flex" />
        </div>

        <div className="justify-start sm:hidden">
          <h1 className="text-center text-xl font-bold">WiE Academy</h1>
        </div>

        {/* RIGHT SIDE CONTAINER: Mobile menu and profile */}
        <div className="flex items-center space-x-4">
          <ProfileDropdown
            user={user}
            open={dropdownOpen}
            onOpenChange={setDropdownOpen}
            accountItems={accountItems}
            handleNavClick={handleNavClick}
            handleSignOut={handleSignOut}
            className="hidden sm:flex"
          />

          {/* MOBILE MENU: Show hamburger menu on mobile */}
          <MobileSidebar
            user={user}
            open={sidebarOpen}
            onOpenChange={setSidebarOpen}
            pathname={pathname}
            navItems={navItems}
            accountItems={accountItems}
            handleNavClick={handleNavClick}
            handleSignOut={handleSignOut}
            className="sm:hidden"
          />
        </div>
      </div>
    </>
  )
}
