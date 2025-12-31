import { Role } from "@/lib/prisma/enums"
import { LucideProps } from "lucide-react"
import { ForwardRefExoticComponent, RefAttributes } from "react"

export type User = {
  firstName: string
  lastName: string
  email: string
  image: string | null
  role: Role
  id: string
}

export type NavItem = {
  href: string
  label: string
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
  surfaces: Array<"mobile" | "desktop">
  allow?: (user: User) => boolean
}
