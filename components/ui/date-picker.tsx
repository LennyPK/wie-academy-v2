"use client"

import { ChevronDownIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format, getMonth, getYear, setMonth, setYear } from "date-fns"
import { Input } from "./input"

interface DatePickerProps {
  id?: string
  name?: string
  value: Date | null
  onChange?: (value: Date | null) => void
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  "aria-invalid"?: boolean
  className?: string

  startYear?: number
  endYear?: number
  disableFutureDates?: boolean
}

export function DatePicker({
  id,
  name,
  value,
  onBlur,
  onChange,
  "aria-invalid": ariaInvalid,
  className,

  startYear = getYear(new Date()) - 100,
  endYear = getYear(new Date()) + 100,
  disableFutureDates,

  ...props
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)

  // Sync internal date state with form value
  React.useEffect(() => {
    if (value) {
      setDate(new Date(value))
    } else {
      setDate(undefined)
    }
  }, [value])

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)

  const handleMonthChange = (month: string) => {
    const base = date ?? new Date()

    const newDate = setMonth(base, months.indexOf(month))
    setDate(newDate)
  }

  const handleYearChange = (year: string) => {
    const base = date ?? new Date()

    const newDate = setYear(base, parseInt(year))
    setDate(newDate)
  }

  const handleSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return
    setDate(selectedDate)
    setOpen(false)
    onChange?.(selectedDate)
  }

  return (
    <>
      {/* Compatibility with form */}
      <Input
        id={id}
        name={name}
        value={value ? value.toISOString() : ""}
        onBlur={onBlur}
        aria-invalid={ariaInvalid}
        hidden
        readOnly
        {...props}
      />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            name={name}
            aria-invalid={ariaInvalid}
            data-empty={!date}
            variant="outline"
            className={cn(
              "w-48 cursor-pointer justify-between font-normal hover:bg-background data-[empty=true]:text-muted-foreground",
              className
            )}
            {...props}
          >
            {date ? format(date, "PPP") : "Select Date"}
            <ChevronDownIcon className="size-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <div className="flex justify-between gap-2 p-2">
            <Select value={months[getMonth(date ?? new Date())]} onValueChange={handleMonthChange}>
              <SelectTrigger id="month" className="flex-1">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={getYear(date ?? new Date()).toString()} onValueChange={handleYearChange}>
              <SelectTrigger id="year" className="flex-1">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Calendar
            mode="single"
            selected={date}
            captionLayout="label"
            onSelect={handleSelect}
            autoFocus
            month={date}
            onMonthChange={setDate}
            hidden={disableFutureDates ? { after: new Date() } : undefined}
          />
        </PopoverContent>
      </Popover>
    </>
  )
}
