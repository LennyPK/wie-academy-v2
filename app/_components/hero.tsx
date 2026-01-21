"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ROUTES } from "@/lib/constants"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const navigation = [
  { name: "About Us", href: "#" },
  { name: "Events", href: "#" },
  { name: "Schools & Whānau", href: "#" },
]

export default function Hero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div>
      <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Women in Engineering Academy</span>
              <img alt="" src="/logo.svg" className="h-15 w-auto" />
            </a>
          </div>
          <div className="flex lg:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" onClick={() => setMobileMenuOpen(true)}>
                  <span className="sr-only">Open main menu</span>
                  <Menu aria-hidden="true" className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent showCloseButton={false} className="p-6">
                <div className="flex items-center justify-between">
                  <a href="#" className="-m-1.5 p-1.5">
                    <span className="sr-only">Women in Engineering Academy</span>
                    <img alt="" src="/logo.svg" className="h-10 w-auto" />
                  </a>
                  <Button variant="link" onClick={() => setMobileMenuOpen(false)} className="-m-2">
                    <span className="sr-only">Close menu</span>
                    <X aria-hidden="true" className="size-6" />
                  </Button>
                </div>

                <div className="mt-6 flow-root">
                  <div className="-my-6">
                    <div className="space-y-2 py-6">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold hover:bg-muted"
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>

                    <Separator />

                    <div className="py-6">
                      <a
                        href={ROUTES.SIGN_IN}
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold hover:bg-muted"
                      >
                        Sign in
                      </a>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="text-sm/6 font-semibold">
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href={ROUTES.SIGN_IN} className="text-sm/6 font-semibold">
              Sign in <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </nav>
      </header>

      <div className="relative isolate px-6 pt-14 lg:px-8">
        <img
          alt=""
          src="/hero.jpg"
          className="absolute inset-0 -z-10 size-full object-cover object-right opacity-30 md:object-center"
        />

        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
              Empowering the Next Generation of Women Engineers
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-muted-foreground sm:text-xl/8">
              Connect with like-minded students, explore engineering pathways, and grow with
              mentorship and a supportive community.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild>
                <Link href={ROUTES.SIGN_UP}>Join Now</Link>
              </Button>

              <Button variant="link" asChild>
                <Link href="#">
                  Learn More <span aria-hidden="true">→</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
