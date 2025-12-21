"use client"

import RichTextEditor from "@/components/editor/rich-text-editor"
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/multi-select"
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
import { getAnnouncementCategories, getSchools } from "@/lib/database"
import { getRegions } from "@/lib/database/regions"
import { getYearLevels } from "@/lib/database/year-levels"
import { Category, RegionOption, SchoolOption, YearLevelOption } from "@/lib/types"
import { useForm } from "@tanstack/react-form"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { insertAnnouncement } from "../actions"
import { Announcement, NewAnnouncement, Region, School, YearLevel } from "../types"
import { formSchema } from "./form-schema"

// const filter = new Filter()

interface AnnouncementFormProps {
  announcement?: Announcement | null
  setOpen: (open: boolean) => void
}

export default function AnnouncementForm({ setOpen, announcement }: AnnouncementFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  console.log("announcement in form:", announcement)

  const [editorContent, setEditorContent] = useState({
    plain: announcement?.contentPlain ?? "",
    html: announcement?.contentHtml ?? "",
    json: announcement?.contentJson ?? {},
  })

  const initialValues = {
    title: announcement?.title ?? "",
    category: announcement?.categoryId ? String(announcement.category.id) : "",
    regions:
      announcement?.targetRegions.map((region: Region) => String(region.regionId)) ??
      ([] as string[]),
    schools:
      announcement?.targetSchools.map((school: School) => String(school.schoolId)) ??
      ([] as string[]),
    yearLevels:
      announcement?.targetYearLevels.map((yearLevel: YearLevel) => String(yearLevel.yearLevelId)) ??
      ([] as string[]),
    content: announcement?.contentPlain ?? "",
  }

  const form = useForm({
    defaultValues: initialValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      toast.loading("Saving...")

      const newAnnouncementInfo: NewAnnouncement = {
        id: announcement?.id ?? "",
        title: value.title.trim(),
        contentPlain: editorContent.plain.trim(),
        contentHtml: editorContent.html,
        contentJson: JSON.parse(JSON.stringify(editorContent.json)),
        categoryId: Number(value.category),
        schoolIds: value.schools.map((school) => Number(school)),
        regionIds: value.regions.map((region) => Number(region)),
        yearLevelIds: value.yearLevels.map((yearLevel) => Number(yearLevel)),
      }

      const newAnnouncement = await insertAnnouncement(newAnnouncementInfo)
      toast.dismiss()
      toast.success(`New announcement saved: ${newAnnouncement.announcement.title}`)

      setIsLoading(false)
      setOpen(false)

      router.refresh()
    },
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [regions, setRegions] = useState<RegionOption[]>([])
  const [yearLevels, setYearLevels] = useState<YearLevelOption[]>([])
  const [schools, setSchools] = useState<SchoolOption[]>([])

  const [isSchoolsOpen, setIsSchoolsOpen] = useState(false)

  useEffect(() => {
    async function loadData() {
      const [categories, regions, yearLevels, schools] = await Promise.all([
        getAnnouncementCategories(),
        getRegions(),
        getYearLevels(),
        getSchools(),
      ])
      setCategories(categories)
      setRegions(regions)
      setYearLevels(yearLevels)
      setSchools(schools)
    }
    loadData()
  }, [])

  // const titleLength = 100

  return (
    <form
      id="announcement-form"
      className="space-y-6 px-4 py-4 md:px-1"
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

        <FieldGroup className="md:grid md:grid-cols-2 md:grid-rows-2">
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

          <form.Field name="regions">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Regions</FieldLabel>
                  <MultiSelect onValuesChange={field.handleChange} values={field.state.value}>
                    <MultiSelectTrigger
                      id={field.name}
                      aria-invalid={isInvalid}
                      className="w-full cursor-pointer hover:bg-transparent"
                    >
                      <MultiSelectValue
                        placeholder="All Regions"
                        overflowBehavior="scroll-when-open"
                      />
                    </MultiSelectTrigger>
                    <MultiSelectContent>
                      <MultiSelectGroup>
                        {regions.map((region) => (
                          <MultiSelectItem key={region.id} value={String(region.id)}>
                            {region.label}
                          </MultiSelectItem>
                        ))}
                      </MultiSelectGroup>
                    </MultiSelectContent>
                  </MultiSelect>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>

          <form.Field name="schools">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Schools</FieldLabel>
                  <MultiSelect
                    onOpenChange={setIsSchoolsOpen}
                    onValuesChange={field.handleChange}
                    values={field.state.value}
                  >
                    <MultiSelectTrigger
                      id={field.name}
                      aria-invalid={isInvalid}
                      className="w-full cursor-pointer hover:bg-transparent"
                    >
                      <MultiSelectValue
                        placeholder="All Schools"
                        overflowBehavior="scroll-when-open"
                      />
                    </MultiSelectTrigger>
                    <MultiSelectContent>
                      <MultiSelectGroup>
                        {isSchoolsOpen &&
                          schools.map((school) => (
                            <MultiSelectItem key={school.id} value={String(school.id)}>
                              {school.label}
                            </MultiSelectItem>
                          ))}
                      </MultiSelectGroup>
                    </MultiSelectContent>
                  </MultiSelect>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>

          <form.Field name="yearLevels">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Year Levels</FieldLabel>
                  <MultiSelect onValuesChange={field.handleChange} values={field.state.value}>
                    <MultiSelectTrigger
                      id={field.name}
                      aria-invalid={isInvalid}
                      className="w-full cursor-pointer hover:bg-transparent"
                    >
                      <MultiSelectValue
                        placeholder="All Year Levels"
                        overflowBehavior="scroll-when-open"
                      />
                    </MultiSelectTrigger>
                    <MultiSelectContent>
                      <MultiSelectGroup>
                        {yearLevels.map((yearLevel) => (
                          <MultiSelectItem key={yearLevel.id} value={String(yearLevel.id)}>
                            {yearLevel.label}
                          </MultiSelectItem>
                        ))}
                      </MultiSelectGroup>
                    </MultiSelectContent>
                  </MultiSelect>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
        </FieldGroup>

        <form.Field name="content">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field>
                <div className="group" data-invalid={isInvalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="group-data-[invalid=true]:text-destructive"
                  >
                    Content
                  </FieldLabel>
                </div>
                <RichTextEditor
                  placeholder="Type here..."
                  initialContent={
                    announcement?.contentJson
                      ? JSON.parse(JSON.stringify(announcement?.contentJson))
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

        <Field>
          <div className="grid grid-rows-2 gap-4 md:grid-cols-2">
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
