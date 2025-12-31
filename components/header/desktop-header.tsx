"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { NavItem } from "./types"

interface DesktopHeaderProps {
  navItems: NavItem[]
  pathname: string
  className?: string
}

export default function DesktopHeader({ navItems, pathname, className }: DesktopHeaderProps) {
  return (
    <div className={cn(className)}>
      {navItems
        .filter((item) => item.surfaces.includes("desktop"))
        .map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "mx-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground hover:bg-primary/80"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
    </div>
  )
}
