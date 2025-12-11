"use client"

import { getAnnouncementCategories } from "@/lib/database"
import { getRegions } from "@/lib/database/regions"
import { getYearLevels } from "@/lib/database/year-levels"
import { AnnouncementCategory } from "@/lib/generated/prisma/client"
import { RegionOption, YearLevelOption } from "@/lib/types"
import { useForm } from "@tanstack/react-form"
// import { AnnouncementCategory, announcementCategoryLabels } from "@/lib/types/announcement"
// import { searchNZSchools } from "@/services/school-service"
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
      // contentHtml: "",
      // contentJson: {},
    },
    validators: {
      onSubmit: formCreateSchema,
    },
    onSubmit: async ({ value }) => {
      if (!editorContent.plain.trim()) {
        toast.error("Content is required")
        return
      }

      const announcementInfo: NewAnnouncement = {
        title: value.title,
        contentPlain: editorContent.plain,
        contentHtml: editorContent.html,
        contentJson: editorContent.json,
        categoryId: Number(value.category),
        schools: value.schools,
        regionIds: value.regions.map((region) => Number(region)),
        yearLevelIds: value.yearLevels.map((yearLevel) => Number(yearLevel)),
      }

      const announcement = await createAnnouncement(announcementInfo)
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

  // FIXME: Change to use form hooks later.
  // const [title, setTitle] = useState("")
  // // const [category, setCategory] = useState<AnnouncementCategory>()
  // const [schools, setSchools] = useState<string[]>([])
  // const [schoolSearch, setSchoolSearch] = useState<string>("")
  // const [categoryOptions, setCategoryOptions] = useState<AnnouncementCategory[]>([])
  // const [schoolOptions, setSchoolOptions] = useState<{ value: string; label: string }[]>([])
  // const [regionOptions, setRegionOptions] = useState<RegionOption[]>([])
  // const [years, setYears] = useState<string[]>([])
  // const [plainTextContent, setPlainTextContent] = useState("")
  // const [htmlContent, setHtmlContent] = useState("")
  // const [content, setContent] = useState<object>({})
  // const titleLength = 100

  // console.log(htmlContent)
  // console.log(content)

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   // const supabase = createClient()
  //   // const { data: user } = await supabase.auth.getUser()
  //   // const userId = user.user?.id

  //   // const { error } = await supabase.from(TABLES.ANNOUNCEMENTS).insert({
  //   //   title: title,
  //   //   category: category,
  //   //   target_regions: regions,
  //   //   target_schools: schools,
  //   //   target_years: years.map(function (item) {
  //   //     return parseInt(item, 10)
  //   //   }),
  //   //   content_plain: plainTextContent,
  //   //   content_html: htmlContent,
  //   //   content_json: content,
  //   //   author_id: userId,
  //   // })

  //   // if (error) {
  //   //   toast.error("Error creating announcement", {
  //   //     description: error.message,
  //   //   })
  //   //   console.error("Error creating announcement:", error)
  //   //   return
  //   // }

  //   toast.success("Announcement created successfully", { description: title })
  //   setOpen(false)
  //   router.refresh()
  // }
  // const isInvalid = !title.trim() || !plainTextContent.trim()

  // const yearOptions = YEAR_LEVELS.map((year) => ({
  //   value: year.value,
  //   label: year.label,
  // }))CreateDialogProps

  // const regionOptions = REGIONS.map((region) => ({
  //   value: region.value,
  //   label: region.label,
  // }))

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
                            {/* <MultiSelectItem key={region.id} value={region.value}> */}
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
                            {/* <MultiSelectItem key={yearLevel.id} value={yearLevel.value}> */}
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
            const isInvalid = field.state.meta.isTouched && !editorContent.plain.trim()
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
                  onChangePlainText={(plain) => setEditorContent((prev) => ({ ...prev, plain }))}
                  onChangeHTML={(html) => setEditorContent((prev) => ({ ...prev, html }))}
                  onChangeJSON={(json) => setEditorContent((prev) => ({ ...prev, json }))}
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

  // return (
  //   <form className="w-full space-y-6 px-4 py-4 md:px-1" onSubmit={handleSubmit}>
  //     <div className="space-y-2">
  //       <Label htmlFor="title" className="text-sm font-medium">
  //         Title *
  //       </Label>
  //       <Input
  //         type="text"
  //         placeholder="Title"
  //         variant="heading"
  //         value={title}
  //         onChange={(e) => {
  //           if (e.target.value.length <= titleLength) {
  //             setTitle(filter.clean(e.target.value))
  //           }
  //         }}
  //         maxLength={titleLength}
  //       />
  //       <p className={"px-1 text-xs text-gray-500"}>
  //         {title.length} / {titleLength}
  //       </p>
  //     </div>

  //     <div className="space-y-2">
  //       <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
  //         <div className="flex flex-col space-y-2">
  //           <Label htmlFor="category" className="text-sm font-medium">
  //             Category *
  //           </Label>
  //           <DropdownMenu>
  //             <DropdownMenuTrigger asChild className="w-full">
  //               <Button variant="outline" className="justify-between bg-card">
  //                 {/* {announcementCategoryLabels[category]} */}
  //                 {category?.label}
  //                 <ChevronDown className="h-4 w-4 opacity-50" />
  //               </Button>
  //             </DropdownMenuTrigger>
  //             <DropdownMenuContent
  //               className="dropdown-content-width-full"
  //               align="start"
  //               style={{ maxHeight: "300px", overflowY: "auto", scrollbarWidth: "none" }}
  //             >
  //               {categoryOptions.map((category) => (
  //                 <DropdownMenuItem
  //                   key={category.value}
  //                   onSelect={() => setCategory(category)}
  //                   className="cursor-pointer hover:bg-gray-100"
  //                 >
  //                   {category.label}
  //                 </DropdownMenuItem>
  //               ))}
  //             </DropdownMenuContent>
  //           </DropdownMenu>
  //         </div>
  //         <div className="flex flex-col space-y-2">
  //           <Label htmlFor="region" className="text-sm font-medium">
  //             Region
  //           </Label>
  //           <MultiSelect onValuesChange={setRegions} values={regions}>
  //             <MultiSelectTrigger className="w-full">
  //               <MultiSelectValue placeholder="All Regions" overflowBehavior="scroll-when-open" />
  //             </MultiSelectTrigger>
  //             <MultiSelectContent>
  //               <MultiSelectGroup>
  //                 {regionOptions.map((option) => (
  //                   <MultiSelectItem key={option.value} value={option.value}>
  //                     {option.label}
  //                   </MultiSelectItem>
  //                 ))}
  //               </MultiSelectGroup>
  //             </MultiSelectContent>
  //           </MultiSelect>
  //         </div>
  //       </div>
  //       <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
  //         <div className="flex flex-col space-y-2">
  //           <Label htmlFor="school" className="text-sm font-medium">
  //             School
  //           </Label>
  //           <MultiSelect onValuesChange={setSchools} values={schools}>
  //             <MultiSelectTrigger className="w-full">
  //               <MultiSelectValue placeholder="All Schools" overflowBehavior="scroll-when-open" />
  //             </MultiSelectTrigger>
  //             <MultiSelectContent
  //               onSearchChange={setSchoolSearch}
  //               search={{ placeholder: "Type to search schools..." }}
  //               searchValue={schoolSearch}
  //               useExternalSearch={true}
  //             >
  //               <MultiSelectGroup>
  //                 {schoolOptions.map((option) => (
  //                   <MultiSelectItem key={option.value} value={option.value}>
  //                     {option.label}
  //                   </MultiSelectItem>
  //                 ))}
  //               </MultiSelectGroup>
  //             </MultiSelectContent>
  //           </MultiSelect>
  //         </div>
  //         <div className="flex flex-col space-y-2">
  //           <Label htmlFor="year" className="text-sm font-medium">
  //             Year
  //           </Label>
  //           <MultiSelect onValuesChange={setYears} values={years}>
  //             <MultiSelectTrigger className="w-full">
  //               <MultiSelectValue placeholder="All Years" overflowBehavior="scroll-when-open" />
  //             </MultiSelectTrigger>
  //             <MultiSelectContent>
  //               <MultiSelectGroup>
  //                 {yearOptions.map((option) => (
  //                   <MultiSelectItem key={option.value} value={option.value}>
  //                     {option.label}
  //                   </MultiSelectItem>
  //                 ))}
  //               </MultiSelectGroup>
  //             </MultiSelectContent>
  //           </MultiSelect>
  //         </div>
  //       </div>
  //     </div>

  //     <div className="space-y-2">
  //       <Label htmlFor="content" className="text-sm font-medium">
  //         Content *
  //       </Label>
  //       <RichTextEditor
  //         placeholder="Type here..."
  //         onChangePlainText={setPlainTextContent}
  //         onChangeHTML={setHtmlContent}
  //         onChangeJSON={setContent}
  //       />
  //     </div>

  //     <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
  //       {/* FIXME: idk why this works but it does, it's not a good solution.
  //       Needs to be changed to accomodate for both drawer and dialog. */}
  //       {/* <DrawerClose asChild>
  //         <Button type="button" variant="outline" onClick={() => setOpen(false)}>
  //           Cancel
  //         </Button>
  //       </DrawerClose>
  //       <DrawerClose asChild>
  //         <Button type="submit" disabled={isInvalid}>
  //           Create Announcement
  //         </Button>
  //       </DrawerClose> */}
  //     </div>
  //   </form>
  // )
}
