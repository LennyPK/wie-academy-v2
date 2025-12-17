"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { List, RowComponentProps } from "react-window"

type Item = {
  value: string
  label: string
}

interface ComboboxProps {
  placeholder: string
  items: Item[]
  value: string
  onValueChange: (value: string) => void
  disabled: boolean
  isPending: boolean
  limit: number
  /** number of results to show when a search query is present */
  searchLimit?: number
}

export function Combobox({
  placeholder,
  items,
  value,
  onValueChange,
  disabled,
  isPending,
  limit,
  searchLimit,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const effectiveSearchLimit = searchLimit ?? Math.max(limit * 5, 50)

  // derive filtered items based on query
  const filteredItems = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter(
      (it) => it.label.toLowerCase().includes(q) || it.value.toLowerCase().includes(q)
    )
  }, [items, query])

  const showItems = React.useMemo(() => {
    const q = query.trim()
    if (!q) return items.slice(0, limit)
    return filteredItems.slice(0, effectiveSearchLimit)
  }, [items, filteredItems, query, limit, effectiveSearchLimit])

  const ROW_HEIGHT = 35

  const Row = ({ index, style }: RowComponentProps) => {
    const item = showItems[index]
    return (
      <div style={style} key={item.value}>
        <CommandItem
          key={item.value}
          value={item.value}
          keywords={[item.value, item.label]}
          onSelect={(currentValue) => {
            onValueChange(currentValue === String(value) ? "" : currentValue)
            setOpen(false)
          }}
        >
          {item.label}
          <Check className={cn("ml-auto", value === item.value ? "opacity-100" : "opacity-0")} />
        </CommandItem>
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          data-empty={value === ""}
          aria-expanded={open}
          disabled={disabled}
          className="w-[200px] justify-between bg-transparent font-normal hover:bg-transparent data-[empty=true]:text-muted-foreground"
        >
          {value ? items.find((item) => item.value === value)?.label : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Command>
          <CommandInput
            placeholder={placeholder}
            className="h-9"
            onValueChange={(v: string) => setQuery(v)}
          />
          <CommandList>
            <CommandEmpty>No items found.</CommandEmpty>
            <CommandGroup>
              {!isPending && showItems.length > 0 ? (
                <List
                  rowProps={{}}
                  rowCount={showItems.length}
                  rowComponent={Row}
                  rowHeight={ROW_HEIGHT}
                />
              ) : null}
              {!isPending && showItems.length === 0 ? (
                <CommandEmpty>No items found.</CommandEmpty>
              ) : null}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
