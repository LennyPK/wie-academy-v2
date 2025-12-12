"use client"

import RichTextEditor from "@/components/editor/rich-text-editor"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getAnnouncementCategories } from "@/lib/database"
import { getRegions } from "@/lib/database/regions"
import { getYearLevels } from "@/lib/database/year-levels"
import { AnnouncementCategory } from "@/lib/generated/prisma/client"
import { RegionOption, YearLevelOption } from "@/lib/types"
import { useForm } from "@tanstack/react-form"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { createAnnouncement } from "../actions"
import { NewAnnouncement } from "../types"
import { formCreateSchema } from "./form-create-schema"

// const filter = new Filter()

interface FormCreateProps {
  setOpen: (open: boolean) => void
}

export default function FormCreate({ setOpen }: FormCreateProps) {
  const router = useRouter()
  const [editorContent, setEditorContent] = useState({
    plain: "",
    html: "",
    json: {},
  })

  const form = useForm({
    defaultValues: {
      title: "",
      category: "",
      regions: [] as string[],
      schools: [] as string[],
      yearLevels: [] as string[],
      content: "",
    },
    validators: {
      onSubmit: formCreateSchema,
    },
    onSubmit: async ({ value }) => {
      const newAnnouncement: NewAnnouncement = {
        title: value.title.trim(),
        contentPlain: editorContent.plain.trim(),
        contentHtml: editorContent.html,
        contentJson: JSON.parse(JSON.stringify(editorContent.json)),
        categoryId: Number(value.category),
        schools: value.schools,
        regionIds: value.regions.map((region) => Number(region)),
        yearLevelIds: value.yearLevels.map((yearLevel) => Number(yearLevel)),
      }

      const announcement = await createAnnouncement(newAnnouncement)
      toast.success(announcement.announcement.title)

      setOpen(false)

      // Do db call here
      router.refresh()
    },
  })

  const [categories, setCategories] = useState<AnnouncementCategory[]>([])
  const [regions, setRegions] = useState<RegionOption[]>([])
  const [yearLevels, setYearLevels] = useState<YearLevelOption[]>([])

  useEffect(() => {
    async function loadData() {
      const [categories, regions, yearLevels] = await Promise.all([
        getAnnouncementCategories(),
        getRegions(),
        getYearLevels(),
      ])
      setCategories(categories)
      setRegions(regions)
      setYearLevels(yearLevels)
    }
    loadData()
  }, [])

  // const [schools, setSchools] = useState<string[]>([])
  // const [schoolSearch, setSchoolSearch] = useState<string>("")
  // const [schoolOptions, setSchoolOptions] = useState<{ value: string; label: string }[]>([])
  // const titleLength = 100

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

  // FIXME: Maybe better to move this to page level
  // useEffect(() => {
  //   // let active = true
  //   const fetchSchools = async () => {
  //     // const { results } = await searchNZSchools(schoolSearch)
  //     // if (active) setSchoolOptions(results)
  //     setSchoolOptions([])
  //     const categories = await getAnnouncementCategories()
  //     const regions = await getRegions()
  //     const years = await getYearLevels()
  //     setCategoryOptions(categories)
  //     setRegionOptions(regions)
  //     setYearOptions(years)

  //     setCategory(categories[0])
  //   }
  //   fetchSchools()
  //   return () => {
  //     // active = false
  //   }
  // }, [schoolSearch])

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
                  <MultiSelect onValuesChange={field.handleChange} values={field.state.value}>
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
                        {/* {schools.map((school) => (
                          <MultiSelectItem key={school.id} value={String(school.id)}>
                            {school.label}
                          </MultiSelectItem>
                        ))} */}
                        <MultiSelectItem value="school-1">School 1</MultiSelectItem>
                        <MultiSelectItem value="school-2">School 2</MultiSelectItem>
                        <MultiSelectItem value="school-3">School 3</MultiSelectItem>
                        <MultiSelectItem value="school-4">School 4</MultiSelectItem>
                        <MultiSelectItem value="school-5">School 5</MultiSelectItem>
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
            <Button type="submit" className="flex-1 cursor-pointer">
              Create Announcement
            </Button>
          </div>
        </Field>
      </FieldGroup>
    </form>
  )
}
