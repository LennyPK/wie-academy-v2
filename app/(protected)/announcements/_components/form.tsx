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
import { AnnouncementCategory } from "@/lib/generated/prisma/client"
import { RegionOption, SchoolOption, YearLevelOption } from "@/lib/types"
import { useForm } from "@tanstack/react-form"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { insertAnnouncement } from "../actions"
import { Announcement, NewAnnouncement, Region, School, YearLevel } from "../types"
import { formSchema } from "./form-schema"

// const filter = new Filter()

interface FormCreateProps {
  announcement?: Announcement | null
  setOpen: (open: boolean) => void
}

export default function Form({ setOpen, announcement }: FormCreateProps) {
  const router = useRouter()

  console.log("announcement in form:", announcement)

  // const [editorContent, setEditorContent] = useState({
  //   plain: announcement?.contentPlain ?? "",
  //   html: announcement?.contentHtml ?? "",
  //   json: announcement?.contentJson ?? {},
  // })
  const [editorContent, setEditorContent] = useState({
    plain: announcement?.contentPlain ?? "",
    html: announcement?.contentHtml ?? "",
    json: announcement?.contentJson ?? {},
  })

  // Keep a ref for the latest editor content so onSubmit can read freshest value
  // const editorContentRef = useRef(editorContent)

  // // Debounced update to reduce re-renders when typing quickly in the editor
  // const debouncedUpdate = useDebouncedCallback(
  //   (next: Partial<typeof editorContent>) => {
  //     setEditorContent((prev) => ({ ...prev, ...next }))
  //     editorContentRef.current = { ...editorContentRef.current, ...next }
  //   },
  //   // 200ms is a reasonable default for typing responsiveness
  //   200
  // )

  // const initialValues = {
  //   title: announcement?.title ?? "",
  //   category: announcement?.category?.id ? String(announcement.category.id) : "",
  //   regions:
  //     announcement?.targetRegions?.map((region: Region) => String(region.regionId)) ??
  //     ([] as string[]),
  //   schools:
  //     announcement?.targetSchools?.map((school: School) => String(school.schoolId)) ??
  //     ([] as string[]),
  //   yearLevels:
  //     announcement?.targetYearLevels?.map((yearLevel: YearLevel) =>
  //       String(yearLevel.yearLevelId)
  //     ) ?? ([] as string[]),
  //   content: announcement?.contentPlain ?? "",
  // }
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
      // Ensure any pending debounced editor updates are flushed so we read the
      // freshest content immediately before submitting.
      // try {
      //   // use-debounce exposes a flush method on the debounced callback
      //   // (see useDebouncedCallback.flush)
      //   debouncedUpdate.flush?.()
      // } catch {
      //   // no-op if flush is not available for some reason
      // }

      // // Read latest content from the ref which is updated immediately on input
      // const latestContent = editorContentRef.current

      // TODO: Disable button when announcement is being saved
      const newAnnouncementInfo: NewAnnouncement = {
        id: announcement?.id ?? "",
        title: value.title.trim(),
        // contentPlain: latestContent.plain.trim(),
        // contentHtml: latestContent.html,
        // contentJson: JSON.parse(JSON.stringify(latestContent.json)),
        contentPlain: editorContent.plain.trim(),
        contentHtml: editorContent.html,
        contentJson: JSON.parse(JSON.stringify(editorContent.json)),
        categoryId: Number(value.category),
        schoolIds: value.schools.map((school) => Number(school)),
        regionIds: value.regions.map((region) => Number(region)),
        yearLevelIds: value.yearLevels.map((yearLevel) => Number(yearLevel)),
      }

      const newAnnouncement = await insertAnnouncement(newAnnouncementInfo)
      toast.success(newAnnouncement.announcement.title)

      setOpen(false)

      router.refresh()
    },
  })

  const [categories, setCategories] = useState<AnnouncementCategory[]>([])
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
                  initialContent={announcement?.contentHtml}
                  // onChangeHTML={(html) => debouncedUpdate({ html })}
                  // onChangeJSON={(json) => debouncedUpdate({ json })}
                  // onChangePlainText={(plain) => {
                  //   // write immediate plain text to a ref to keep latest content for submit
                  //   editorContentRef.current = { ...editorContentRef.current, plain }
                  //   // debounce state updates to avoid re-renders while typing
                  //   debouncedUpdate({ plain })
                  //   // update the form's content field but debounce the heavy state changes
                  //   field.handleChange(plain)
                  // }}
                  onChangeHTML={(html) => setEditorContent((prev) => ({ ...prev, html }))}
                  onChangeJSON={(json) => setEditorContent((prev) => ({ ...prev, json }))}
                  onChangePlainText={(plain) => {
                    setEditorContent((prev) => ({ ...prev, plain }))
                    field.handleChange(plain)
                  }}
                />
                {/* <RichTextEditor
                  placeholder="Type here..."
                  onChangeHTML={(html) => setEditorContent((prev) => ({ ...prev, html }))}
                  onChangeJSON={(json) => setEditorContent((prev) => ({ ...prev, json }))}
                  onChangePlainText={(plain) => {
                    setEditorContent((prev) => ({ ...prev, plain }))
                    field.handleChange(plain)
                  }}
                /> */}
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
              {/* Create Announcement */}
              Submit
            </Button>
          </div>
        </Field>
      </FieldGroup>
    </form>
  )
}
