import { cva, VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils/index"

const inputVariants = cva(
  [
    "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground dark:bg-input/30",
    "selection:bg-primary selection:text-primary-foreground",
    "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground",
    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: "text-base md:text-sm file:text-sm",
        heading: "text-xl md:text-2xl font-bold px-4 py-10 file:text-base file:font-medium",
      },
      defaultVariants: {
        variant: "default",
      },
    },
  }
)

function Input({
  className,
  variant,
  type,
  ...props
}: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Input, inputVariants }
