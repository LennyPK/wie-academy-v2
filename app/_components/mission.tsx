import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Mission() {
  return (
    <div className="mx-auto max-w-6xl py-32 text-center sm:py-48">
      <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
        Together, we can improve diversity in engineering
      </h1>
      <p className="mt-8 text-lg font-medium text-pretty text-muted-foreground sm:text-xl/8">
        We are here to empower high school women* interested in STEM—especially engineering—to
        understand what engineering is, what opportunities exist at university and beyond, and how
        they can shape the future.
      </p>

      <p className="mt-8 text-lg font-medium text-pretty text-muted-foreground sm:text-xl/8">
        Through the Women in Engineering Academy, we nurture an inclusive community and support
        students to make informed career decisions, helping create a more diverse and impactful
        engineering workforce.
      </p>

      <p className="mt-8 text-sm text-pretty text-muted-foreground italic sm:text-base">
        *Inclusive of high school women and non-binary students
      </p>

      <Button variant="link" className="py-10" asChild>
        <Link href="#">
          Learn More<span aria-hidden="true">→</span>
        </Link>
      </Button>
    </div>
  )
}
