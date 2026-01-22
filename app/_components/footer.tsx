import { Button } from "@/components/ui/button"
import { Instagram, Linkedin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const navigation = [
  { name: "About Us", href: "#" },
  { name: "Events", href: "#" },
  { name: "Outreach Workshops", href: "#" },
  { name: "Contact Us", href: "#" },
]

const socials = [
  { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/wie_academy/" },
  { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/company/wie-academy" },
]

const uoa = [
  {
    name: "The University of Auckland",
    href: "https://www.instagram.com/wie_academy/",
  },
  {
    name: "Accessibility",
    href: "https://www.instagram.com/wie_academy/",
  },
  {
    name: "Copyright",
    href: "https://www.instagram.com/wie_academy/",
  },
  {
    name: "Privacy",
    href: "https://www.instagram.com/wie_academy/",
  },
  {
    name: "Disclaimer",
    href: "https://www.instagram.com/wie_academy/",
  },
]

export default function Footer() {
  return (
    <div>
      <div className="flex w-full flex-col items-center justify-center gap-5 bg-primary py-24 sm:py-32">
        <div className="flex flex-wrap items-center justify-center">
          {navigation.map((item) => (
            <Button asChild key={item.name} variant="link" className="text-primary-foreground">
              <Link href={item.href}>{item.name}</Link>
            </Button>
          ))}
        </div>

        <div className="mx-auto flex gap-5">
          {socials.map((item) => (
            <Button asChild key={item.name} variant="link" className="text-primary-foreground">
              <Link href={item.href}>
                <item.icon className="size-6" />
              </Link>
            </Button>
          ))}
        </div>

        <div className="flex gap-10">
          <Image src="/uoa-logo.png" alt="University of Auckland" width={150} height={100} />
          <Image
            src="/fp-healthcare-foundation.png"
            alt="FP Healthcare Foundation"
            width={150}
            height={100}
          />
        </div>
      </div>

      <div className="flex w-full flex-wrap items-center justify-center bg-muted-foreground py-5">
        {uoa.map((item) => (
          <Button asChild key={item.name} variant="link" className="text-primary-foreground">
            <Link href={item.href}>{item.name}</Link>
          </Button>
        ))}
      </div>
    </div>
  )
}
