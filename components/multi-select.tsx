"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react"

type MultiSelectContextType = {
  open: boolean
  setOpen: (open: boolean) => void
  selectedValues: Set<string>
  toggleValue: (value: string) => void
  items: Map<string, ReactNode>
  onItemAdded: (value: string, label: ReactNode) => void
}
const MultiSelectContext = createContext<MultiSelectContextType | null>(null)

function MultiSelect({
  children,
  values,
  defaultValues,
  onValuesChange,
}: {
  children: ReactNode
  values?: string[]
  defaultValues?: string[]
  onValuesChange?: (values: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const [internalValues, setInternalValues] = useState(new Set<string>(values ?? defaultValues))
  const selectedValues = values ? new Set(values) : internalValues
  const [items, setItems] = useState<Map<string, ReactNode>>(new Map())

  function toggleValue(value: string) {
    const getNewSet = (prev: Set<string>) => {
      const newSet = new Set(prev)
      if (newSet.has(value)) {
        newSet.delete(value)
      } else {
        newSet.add(value)
      }
      return newSet
    }
    setInternalValues(getNewSet)
    onValuesChange?.([...getNewSet(selectedValues)])
  }

  const onItemAdded = useCallback((value: string, label: ReactNode) => {
    setItems((prev) => {
      if (prev.get(value) === label) return prev
      return new Map(prev).set(value, label)
    })
  }, [])

  return (
    <MultiSelectContext
      value={{
        open,
        setOpen,
        selectedValues,
        toggleValue,
        items,
        onItemAdded,
      }}
    >
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </MultiSelectContext>
  )
}

function MultiSelectTrigger({
  className,
  children,
  ...props
}: {
  className?: string
  children?: ReactNode
} & ComponentPropsWithoutRef<typeof Button>) {
  const { open } = useMultiSelectContext()

  return (
    <PopoverTrigger asChild>
      <Button
        {...props}
        variant={props.variant ?? "outline"}
        role={props.role ?? "combobox"}
        aria-expanded={props["aria-expanded"] ?? open}
        className={cn(
          "flex h-auto min-h-9 w-fit items-center justify-between gap-2 overflow-hidden rounded-md border border-input bg-transparent px-3 py-1.5 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
          className
        )}
      >
        {children}
        <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
  )
}

function MultiSelectValue({
  placeholder,
  clickToRemove = true,
  className,
  overflowBehavior = "cutoff",
  ...props
}: {
  placeholder?: string
  clickToRemove?: boolean
  overflowBehavior?: "wrap" | "wrap-when-open" | "cutoff" | "scroll" | "scroll-when-open"
} & Omit<ComponentPropsWithoutRef<"div">, "children">) {
  const { selectedValues, toggleValue, items, open } = useMultiSelectContext()
  const [overflowAmount, setOverflowAmount] = useState(0)
  const valueRef = useRef<HTMLDivElement>(null)
  const overflowRef = useRef<HTMLDivElement>(null)

  const shouldWrap = overflowBehavior === "wrap" || (overflowBehavior === "wrap-when-open" && open)
  const shouldScroll =
    overflowBehavior === "scroll" || (overflowBehavior === "scroll-when-open" && open)

  const checkOverflow = useCallback(() => {
    // For scroll behaviors, we don't need overflow calculation since items will scroll
    if (shouldScroll) {
      setOverflowAmount(0)
      return
    }

    // For wrap behavior, never show overflow badge (items wrap instead)
    if (overflowBehavior === "wrap") {
      setOverflowAmount(0)
      return
    }

    // For wrap-when-open behavior, only show overflow when closed
    if (overflowBehavior === "wrap-when-open") {
      if (open) {
        setOverflowAmount(0)
        return
      }
      // When closed, show overflow badge if we have more than 1 item
      setOverflowAmount(selectedValues.size > 1 ? selectedValues.size - 1 : 0)
      return
    }

    // For cutoff behavior, always show overflow badge (both open and closed)
    if (overflowBehavior === "cutoff") {
      setOverflowAmount(selectedValues.size > 1 ? selectedValues.size - 1 : 0)
      return
    }

    // Default behavior (cutoff) - show overflow badge if we have more than 1 item
    setOverflowAmount(selectedValues.size > 1 ? selectedValues.size - 1 : 0)
  }, [open, selectedValues.size, shouldScroll, overflowBehavior])

  const handleResize = useCallback(
    (node: HTMLDivElement) => {
      valueRef.current = node

      checkOverflow()

      const observer = new ResizeObserver(() => {
        checkOverflow()
      })
      observer.observe(node)

      return () => {
        observer.disconnect()
        valueRef.current = null
      }
    },
    [checkOverflow]
  )

  if (selectedValues.size === 0 && placeholder) {
    return (
      <span className="min-w-0 overflow-hidden font-normal text-muted-foreground">
        {placeholder}
      </span>
    )
  }

  return (
    <div
      {...props}
      ref={handleResize}
      className={cn(
        "flex w-full gap-1.5 overflow-hidden",
        shouldWrap && "h-full flex-wrap",
        shouldScroll && "overflow-x-auto",
        className
      )}
      style={{
        ...(shouldScroll && { scrollbarWidth: "none" }),
      }}
    >
      {(() => {
        // Determine if we should show all badges or first+overflow based on behavior
        const shouldShowAllBadges =
          shouldScroll || // Scroll behaviors always show all badges
          overflowBehavior === "wrap" || // Wrap behavior always shows all badges
          (overflowBehavior === "wrap-when-open" && open) // Wrap-when-open shows all when open
        // Cutoff and default behaviors show first+overflow in all cases

        if (shouldShowAllBadges) {
          // Show all badges (for scroll, wrap, or wrap-when-open when open)
          return [...selectedValues]
            .filter((value) => items.has(value))
            .map((value) => (
              <Badge
                variant="outline"
                data-selected-item
                className="group flex shrink-0 items-center gap-1"
                key={value}
                onClick={
                  clickToRemove
                    ? (e) => {
                        e.stopPropagation()
                        toggleValue(value)
                      }
                    : undefined
                }
              >
                {items.get(value)}
                {clickToRemove && (
                  <XIcon className="size-2 text-muted-foreground group-hover:text-destructive" />
                )}
              </Badge>
            ))
        } else {
          // Show first badge + overflow badge (for cutoff, wrap-when-open when closed, and default)
          return (
            <>
              {selectedValues.size > 0 &&
                (() => {
                  const firstValue = [...selectedValues][0]
                  if (!items.has(firstValue)) return null
                  return (
                    <Badge
                      key={firstValue}
                      variant="outline"
                      className="shrink-0 text-xs"
                      data-selected-item
                    >
                      {items.get(firstValue)}
                      <XIcon className="size-2 text-muted-foreground" />
                    </Badge>
                  )
                })()}
              {overflowAmount > 0 && (
                <Badge variant="outline" className="shrink-0 text-xs" ref={overflowRef}>
                  +{overflowAmount}
                </Badge>
              )}
            </>
          )
        }
      })()}
    </div>
  )
}

function MultiSelectContent({
  search = true,
  children,
  onSearchChange,
  searchValue,
  useExternalSearch = false,
  ...props
}: {
  search?: boolean | { placeholder?: string; emptyMessage?: string }
  children: ReactNode
  onSearchChange?: (query: string) => void
  searchValue?: string
  useExternalSearch?: boolean
} & Omit<ComponentPropsWithoutRef<typeof Command>, "children">) {
  const canSearch = typeof search === "object" ? true : search

  return (
    <>
      <div style={{ display: "none" }}>
        <Command>
          <CommandList>{children}</CommandList>
        </Command>
      </div>
      <PopoverContent className="min-w-(--radix-popover-trigger-width) p-0">
        <Command {...props} shouldFilter={!useExternalSearch}>
          {canSearch ? (
            <CommandInput
              value={searchValue}
              placeholder={typeof search === "object" ? search.placeholder : undefined}
              onValueChange={(val) => {
                onSearchChange?.(val)
              }}
            />
          ) : (
            <button autoFocus className="sr-only" />
          )}
          <CommandList style={{ scrollbarWidth: "none" }}>
            {canSearch && (
              <CommandEmpty>
                {typeof search === "object" ? search.emptyMessage : undefined}
              </CommandEmpty>
            )}
            {children}
          </CommandList>
        </Command>
      </PopoverContent>
    </>
  )
}

function MultiSelectItem({
  value,
  children,
  badgeLabel,
  onSelect,
  ...props
}: {
  badgeLabel?: ReactNode
  value: string
} & Omit<ComponentPropsWithoutRef<typeof CommandItem>, "value">) {
  const { toggleValue, selectedValues, onItemAdded } = useMultiSelectContext()
  const isSelected = selectedValues.has(value)

  useEffect(() => {
    onItemAdded(value, badgeLabel ?? children)
  }, [value, children, onItemAdded, badgeLabel])

  return (
    <CommandItem
      {...props}
      onSelect={() => {
        toggleValue(value)
        onSelect?.(value)
      }}
    >
      <CheckIcon className={cn("mr-2 size-4", isSelected ? "opacity-100" : "opacity-0")} />
      {children}
    </CommandItem>
  )
}

function MultiSelectGroup(props: ComponentPropsWithoutRef<typeof CommandGroup>) {
  return <CommandGroup {...props} />
}

function MultiSelectSeparator(props: ComponentPropsWithoutRef<typeof CommandSeparator>) {
  return <CommandSeparator {...props} />
}

function useMultiSelectContext() {
  const context = useContext(MultiSelectContext)
  if (context == null) {
    throw new Error("useMultiSelectContext must be used within a MultiSelectContext")
  }
  return context
}

export {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectSeparator,
  MultiSelectTrigger,
  MultiSelectValue,
}
