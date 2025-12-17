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
import { Input } from "./ui/input"

interface Item {
  value: string
  label: string
}

interface ComboboxProps {
  id?: string
  name?: string
  placeholder: string
  items: Item[]
  value: string
  onChange: (value: string) => void
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  "aria-invalid"?: boolean
  className?: string
  disabled?: boolean
}

export function Combobox({
  id,
  name,
  placeholder,
  items,
  value,
  onChange,
  onBlur,
  "aria-invalid": ariaInvalid,
  className,
  disabled = false,
  ...props
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          name={name}
          aria-invalid={ariaInvalid}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          data-empty={value === ""}
          className={cn(
            "w-[200px] justify-between bg-transparent font-normal hover:bg-transparent data-[empty=true]:text-muted-foreground",
            className
          )}
          disabled={disabled}
          {...props}
        >
          {value ? items.find((item) => item.value === value)?.label : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <Input
        id={id}
        name={name}
        value={value}
        onBlur={onBlur}
        aria-invalid={ariaInvalid}
        hidden
        readOnly
        {...props}
      />
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" onBlur={onBlur} />
          <CommandList>
            <CommandEmpty>No items found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  keywords={[item.label, item.value]}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {item.label}
                  <Check
                    className={cn("ml-auto", value === item.value ? "opacity-100" : "opacity-0")}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
