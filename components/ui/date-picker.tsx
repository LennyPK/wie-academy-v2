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
import { format, getMonth, getYear, setMonth, setYear } from "date-fns"
import { Input } from "./input"

interface DatePickerProps {
  id?: string
  // date?: Date
  // onDateChange?: (date: Date | undefined) => void
  startYear?: number
  endYear?: number
  disableFutureDates?: boolean
}

export function DatePicker({
  id,
  startYear = getYear(new Date()) - 100,
  endYear = getYear(new Date()) + 100,
  // date,
  // onDateChange,
  disableFutureDates,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  // const currentDate = date ?? undefined
  // const setCurrentDate = onDateChange ?? (() => {})

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

  const handleSelect = (selectedData: Date | undefined) => {
    if (selectedData) {
      setDate(selectedData)
      setOpen(false)
    }
  }

  return (
    <>
      {/* Compatibility with form */}
      <Input hidden name={id} value={date ? date.toISOString() : ""} />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id}
            data-empty={!date}
            className="w-48 justify-between font-normal data-[empty=true]:text-muted-foreground"
          >
            {date ? format(date, "PPP") : "Select date"}
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
            onSelect={(date) => {
              handleSelect(date)
            }}
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
