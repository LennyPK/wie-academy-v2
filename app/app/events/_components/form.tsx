"use client"

import { DatePicker } from "@/components/date-picker"
import RichTextEditor from "@/components/editor/rich-text-editor"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { getEventCategories } from "@/lib/database"
import { Category } from "@/lib/types"
import { useForm } from "@tanstack/react-form"
import { getYear } from "date-fns"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { insertEvent } from "../actions"
import { Event, NewEvent } from "../types"
import { formSchema } from "./form-schema"

// const filter = new Filter()

interface EventFormProps {
  event?: Event | null
  setOpen: (open: boolean) => void
}

export default function EventForm({ setOpen, event }: EventFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  console.log("event in form:", event)

  const [editorContent, setEditorContent] = useState({
    plain: event?.descriptionPlain ?? "",
    html: event?.descriptionHtml ?? "",
    json: event?.descriptionJson ?? {},
  })

  const initialValues = {
    title: event?.title ?? "",
    description: event?.descriptionPlain ?? "",
    category: event?.categoryId ? String(event.category.id) : "",
    location: event?.location ?? "",
    capacity: event?.capacity ?? 0,
    startDate: event?.startDateTime ?? undefined,
    startTime: event?.startDateTime ?? undefined,
    endDate: event?.endDateTime ?? undefined,
    endTime: event?.endDateTime ?? undefined,
  }

  const form = useForm({
    defaultValues: initialValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      toast.loading("Saving...")

      if (!value.startDate || !value.startTime || !value.endDate || !value.endTime) {
        return
      }

      const start = new Date(
        value.startDate.getFullYear(),
        value.startDate.getMonth(),
        value.startDate.getDate(),
        value.startTime.getHours(),
        value.startTime.getMinutes(),
        value.startTime.getSeconds()
      )
      const end = new Date(
        value.endDate.getFullYear(),
        value.endDate.getMonth(),
        value.endDate.getDate(),
        value.endTime.getHours(),
        value.endTime.getMinutes(),
        value.endTime.getSeconds()
      )

      const eventPayload: NewEvent = {
        id: event?.id ?? "",
        title: value.title.trim(),
        descriptionPlain: editorContent.plain.trim(),
        descriptionHtml: editorContent.html,
        descriptionJson: JSON.parse(JSON.stringify(editorContent.json)),
        categoryId: Number(value.category),
        location: value.location.trim(),
        capacity: value.capacity,
        startDateTime: start,
        endDateTime: end,
      }

      const newEvent = await insertEvent(eventPayload)
      toast.dismiss()
      toast.success(`New event saved: ${newEvent.title}`)

      setIsLoading(false)
      setOpen(false)

      router.refresh()
    },
  })

  const [categories, setCategories] = useState<Category[]>([])
  // const [regions, setRegions] = useState<RegionOption[]>([])
  // const [yearLevels, setYearLevels] = useState<YearLevelOption[]>([])
  // const [schools, setSchools] = useState<SchoolOption[]>([])

  // const [isSchoolsOpen, setIsSchoolsOpen] = useState(false)

  useEffect(() => {
    async function loadData() {
      const [categories] = await Promise.all([
        getEventCategories(),
        // getRegions(),
        // getYearLevels(),
        // getSchools(),
      ])
      setCategories(categories)
      // setRegions(regions)
      // setYearLevels(yearLevels)
      // setSchools(schools)
    }
    loadData()
  }, [])

  // const titleLength = 100

  return (
    <form
      id="event-form"
      className="space-y-6 px-4 py-4 sm:px-1"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        <form.Field name="title">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder="Title"
                  variant="heading"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field name="description">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field>
                <div className="group" data-invalid={isInvalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="group-data-[invalid=true]:text-destructive"
                  >
                    Description
                  </FieldLabel>
                </div>
                <RichTextEditor
                  placeholder="Type here..."
                  initialContent={
                    event?.descriptionJson
                      ? JSON.parse(JSON.stringify(event?.descriptionJson))
                      : undefined
                  }
                  onChangeHTML={(html) => setEditorContent((prev) => ({ ...prev, html }))}
                  onChangeJSON={(json) => setEditorContent((prev) => ({ ...prev, json }))}
                  onChangePlainText={(plain) => {
                    setEditorContent((prev) => ({ ...prev, plain }))
                    field.handleChange(plain)
                  }}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <FieldGroup className="sm:grid sm:grid-cols-2 sm:grid-rows-2">
          <form.Field name="category">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger
                      id={field.name}
                      aria-invalid={isInvalid}
                      className="cursor-pointer"
                    >
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>

          <form.Field name="location">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Location</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    placeholder="Location"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    className="text-sm"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>

          <form.Field name="capacity">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor={field.name}>Capacity</FieldLabel>
                    <Switch
                      checked={field.state.value !== 0}
                      onCheckedChange={(checked) => field.handleChange(checked ? 1 : 0)}
                    />
                  </div>
                  {field.state.value === 0 && (
                    <span className="flex h-full min-h-9 items-center text-sm text-muted-foreground">
                      No capacity limit
                    </span>
                  )}
                  {field.state.value !== 0 && (
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      placeholder="Capacity"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(parseInt(e.target.value))}
                      min={0}
                      aria-invalid={isInvalid}
                      className="text-sm"
                    />
                  )}
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>

          {/* <form.Field name="xpReward">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>XP Rewarad</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    placeholder="Capacity"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(parseInt(e.target.value))}
                    aria-invalid={isInvalid}
                    className="text-sm"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field> */}
        </FieldGroup>

        <FieldGroup className="sm:grid sm:grid-cols-2">
          <FieldGroup id="startDateTime">
            <form.Field name="startDate">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Start Date</FieldLabel>
                    <DatePicker
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={field.handleChange}
                      onBlur={field.handleBlur}
                      endYear={getYear(new Date())}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="startTime">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                const timeString = field.state.value
                  ? `${String(field.state.value.getHours()).padStart(2, "0")}:${String(field.state.value.getMinutes()).padStart(2, "0")}`
                  : ""
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Start Time</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="time"
                      placeholder="Pick a time"
                      value={timeString}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        if (!e.target.value) {
                          field.handleChange(undefined)
                          return
                        }

                        const [hours, minutes] = e.target.value.split(":").map(Number)
                        const date = new Date()
                        date.setHours(hours, minutes, 0, 0)
                        field.handleChange(date)
                      }}
                      aria-invalid={isInvalid}
                      className="text-sm"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.Field>
          </FieldGroup>

          <FieldGroup id="endDateTime">
            <form.Field name="endDate">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>End Date</FieldLabel>
                    <DatePicker
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={field.handleChange}
                      onBlur={field.handleBlur}
                      endYear={getYear(new Date())}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="endTime">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                const timeString = field.state.value
                  ? `${String(field.state.value.getHours()).padStart(2, "0")}:${String(field.state.value.getMinutes()).padStart(2, "0")}`
                  : ""
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>End Time</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="time"
                      placeholder="Pick a time"
                      value={timeString}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        if (!e.target.value) {
                          field.handleChange(undefined)
                          return
                        }

                        const [hours, minutes] = e.target.value.split(":").map(Number)
                        const date = new Date()
                        date.setHours(hours, minutes, 0, 0)
                        field.handleChange(date)
                      }}
                      aria-invalid={isInvalid}
                      className="text-sm"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.Field>
          </FieldGroup>
        </FieldGroup>

        <Field>
          <div className="grid grid-rows-2 gap-4 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 cursor-pointer" disabled={isLoading}>
              Submit
            </Button>
          </div>
        </Field>
      </FieldGroup>
    </form>
  )
}
