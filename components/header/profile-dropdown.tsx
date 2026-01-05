"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components//ui/avatar"
// import { getFullName, getUserInitials } from "@/lib/auth/client"
import { ROUTES } from "@/lib/constants"
// import { User, UserRole } from "@/lib/types/user"
import { Role } from "@/lib/prisma/enums"
import { cn } from "@/lib/utils"
import { PopoverTriggerProps } from "@radix-ui/react-popover"
import { LogOut } from "lucide-react"
import Link from "next/link"
import { Dispatch, SetStateAction } from "react"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Separator } from "../ui/separator"
import { NavItem, User } from "./types"

interface ProfileDropdownProps {
  user: User
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
  accountItems: NavItem[]
  handleNavClick: () => void
  handleSignOut: () => void
  className?: string
}

export default function ProfileDropdown({
  user,
  open,
  onOpenChange,
  accountItems,
  handleNavClick,
  handleSignOut,
  className,
  ...props
}: ProfileDropdownProps & PopoverTriggerProps) {
  const userFullName = `${user.firstName} ${user.lastName}`
  const userInitials = user.firstName[0] + user.lastName[0]
  const userEmail = user.email
  const avatarUrl = user.image
  const userRole = user.role === Role.ADMIN ? "Administrator" : "Student"

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild className={className} {...props}>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-muted">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt="User avatar" />
            ) : (
              <AvatarFallback className="bg-linear-to-br from-primary to-secondary font-semibold text-foreground select-none">
                {userInitials}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto p-0" align="end">
        <div className="flex items-center justify-start gap-2 p-4">
          <div className="space-y-1 leading-none">
            <p className="font-semibold">{userFullName}</p>
            <p className="min-w-[200px] truncate text-sm font-semibold text-muted-foreground">
              {userEmail}
            </p>
            <p className="text-sm text-muted-foreground">{userRole}</p>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col p-1">
          {accountItems
            .filter((item) => item.surfaces.includes("desktop"))
            .filter((item) => !(user.role === Role.ADMIN && item.href === ROUTES.PROFILE))
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={cn(
                  "flex items-center space-x-3 rounded-md px-3 py-3 text-sm font-medium transition-colors",
                  "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
        </div>
        <Separator />
        <div className="p-1">
          <button
            onClick={handleSignOut}
            className={cn(
              "flex w-full items-center space-x-3 rounded-md px-3 py-3 text-sm font-medium transition-colors",
              "text-destructive hover:bg-destructive hover:text-destructive-foreground"
            )}
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
