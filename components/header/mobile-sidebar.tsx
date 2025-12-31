"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ROUTES } from "@/lib/constants"
import { Role } from "@/lib/prisma/enums"
import { cn } from "@/lib/utils"
import { LogOut, Menu } from "lucide-react"
import Link from "next/link"
import { Dispatch, SetStateAction } from "react"
import { NavItem, User } from "./types"

interface MobileSidebarProps {
  user: User
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
  pathname: string
  navItems: NavItem[]
  accountItems: NavItem[]
  handleNavClick: () => void
  handleSignOut: () => void
  className?: string
}

export default function MobileSidebar({
  user,
  open,
  onOpenChange,
  pathname,
  navItems,
  accountItems,
  handleNavClick,
  handleSignOut,
  className,
}: MobileSidebarProps) {
  const userFullName = `${user.firstName} ${user.lastName}`
  const userInitials = user.firstName[0] + user.lastName[0]
  const userEmail = user.email
  const avatarUrl = user.image
  const userRole = user.role === Role.ADMIN ? "Administrator" : "Student"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild className={cn(className)}>
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <SheetTitle hidden />
        <div className="flex h-full flex-col">
          {/* User Profile Section */}
          <div className="border-b p-6">
            <div className="flex items-center gap-x-3">
              <Avatar className="h-12 w-12 ring-2 ring-muted">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt="User avatar" />
                ) : (
                  <AvatarFallback className="bg-linear-to-br from-primary to-secondary font-semibold text-foreground select-none">
                    {userInitials}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{userFullName}</h3>
                <p className="text-sm font-semibold text-muted-foreground">{userEmail}</p>
                <p className="text-sm text-muted-foreground">{userRole}</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-6">
            <div className="space-y-2">
              <h4 className="px-2 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                Menu
              </h4>
              {navItems
                .filter((item) => item.surfaces.includes("mobile"))
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleNavClick}
                    className={cn(
                      "flex items-center space-x-3 rounded-md px-3 py-3 text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground hover:bg-primary/80"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
            </div>

            {/* Account Section */}
            <div className="mt-8 space-y-2">
              <h4 className="px-2 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                Account
              </h4>
              {accountItems
                .filter((item) => item.surfaces.includes("mobile"))
                .filter((item) => !(user.role === Role.ADMIN && item.href === ROUTES.PROFILE))
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleNavClick}
                    className={cn(
                      "flex items-center space-x-3 rounded-md px-3 py-3 text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground hover:bg-primary/80"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              <button
                onClick={handleSignOut}
                className={cn(
                  "flex h-auto w-full items-center justify-start space-x-3 rounded-md px-3 py-3 text-sm font-medium outline-none",
                  "text-destructive transition-colors hover:bg-destructive/80 hover:text-destructive-foreground"
                )}
              >
                <LogOut className="h-5 w-5 shrink-0" />
                <span>Sign Out</span>
              </button>
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
