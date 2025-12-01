"use client"

import RichTextEditor from "@/components/editor/rich-text-editor"
import { Button } from "@/components/ui/button"
import { DrawerClose } from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select"
import { getRegions } from "@/lib/database/regions"
import { getYearLevels } from "@/lib/database/year-levels"
import { AnnouncementCategory, announcementCategoryLabels } from "@/lib/types/announcement"
// import { searchNZSchools } from "@/services/school-service"
import { Filter } from "bad-words"
import { ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const filter = new Filter()
interface CreateDialogProps {
  setOpen: (open: boolean) => void
}

export default function CreateDialog({ setOpen }: CreateDialogProps) {
  const router = useRouter()
  // FIXME: Change to use form hooks later.
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState<AnnouncementCategory>(AnnouncementCategory.GENERAL)
  const [regions, setRegions] = useState<string[]>([])
  const [schools, setSchools] = useState<string[]>([])
  const [schoolSearch, setSchoolSearch] = useState<string>("")
  const [schoolOptions, setSchoolOptions] = useState<{ value: string; label: string }[]>([])
  const [regionOptions, setRegionOptions] = useState<{ value: string; label: string }[]>([])
  const [yearOptions, setYearOptions] = useState<{ value: string; label: string }[]>([])
  const [years, setYears] = useState<string[]>([])
  const [plainTextContent, setPlainTextContent] = useState("")
  const [htmlContent, setHtmlContent] = useState("")
  const [content, setContent] = useState<object>({})
  const titleLength = 100

  console.log(htmlContent)
  console.log(content)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // const supabase = createClient()
    // const { data: user } = await supabase.auth.getUser()
    // const userId = user.user?.id

    // const { error } = await supabase.from(TABLES.ANNOUNCEMENTS).insert({
    //   title: title,
    //   category: category,
    //   target_regions: regions,
    //   target_schools: schools,
    //   target_years: years.map(function (item) {
    //     return parseInt(item, 10)
    //   }),
    //   content_plain: plainTextContent,
    //   content_html: htmlContent,
    //   content_json: content,
    //   author_id: userId,
    // })

    // if (error) {
    //   toast.error("Error creating announcement", {
    //     description: error.message,
    //   })
    //   console.error("Error creating announcement:", error)
    //   return
    // }

    toast.success("Announcement created successfully", { description: title })
    setOpen(false)
    router.refresh()
  }
  const isInvalid = !title.trim() || !plainTextContent.trim()

  // const yearOptions = YEAR_LEVELS.map((year) => ({
  //   value: year.value,
  //   label: year.label,
  // }))

  // const regionOptions = REGIONS.map((region) => ({
  //   value: region.value,
  //   label: region.label,
  // }))

  // FIXME: Maybe better to move this to page level
  useEffect(() => {
    // let active = true
    const fetchSchools = async () => {
      // const { results } = await searchNZSchools(schoolSearch)
      // if (active) setSchoolOptions(results)
      setSchoolOptions([])
      const regions = await getRegions()
      const years = await getYearLevels()
      setRegionOptions(regions)
      setYearOptions(years)
    }
    fetchSchools()
    return () => {
      // active = false
    }
  }, [schoolSearch])

  return (
    <form className="w-full space-y-6 px-4 py-4 md:px-0" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Title *
        </Label>
        <Input
          type="text"
          placeholder="Title"
          // variant="textHeading"
          value={title}
          onChange={(e) => {
            if (e.target.value.length <= titleLength) {
              setTitle(filter.clean(e.target.value))
            }
          }}
          maxLength={titleLength}
        />
        <p className={"px-1 text-xs text-gray-500"}>
          {title.length} / {titleLength}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category *
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="w-full">
                <Button variant="outline" className="justify-between">
                  {announcementCategoryLabels[category]}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="dropdown-content-width-full"
                align="start"
                style={{ maxHeight: "300px", overflowY: "auto", scrollbarWidth: "none" }}
              >
                {Object.entries(announcementCategoryLabels).map(([value, label]) => (
                  <DropdownMenuItem
                    key={value}
                    onSelect={() => setCategory(value as AnnouncementCategory)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="region" className="text-sm font-medium">
              Region
            </Label>
            <MultiSelect onValuesChange={setRegions} values={regions}>
              <MultiSelectTrigger className="w-full">
                <MultiSelectValue placeholder="All Regions" overflowBehavior="scroll-when-open" />
              </MultiSelectTrigger>
              <MultiSelectContent>
                <MultiSelectGroup>
                  {regionOptions.map((option) => (
                    <MultiSelectItem key={option.value} value={option.value}>
                      {option.label}
                    </MultiSelectItem>
                  ))}
                </MultiSelectGroup>
              </MultiSelectContent>
            </MultiSelect>
          </div>
        </div>
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="school" className="text-sm font-medium">
              School
            </Label>
            <MultiSelect onValuesChange={setSchools} values={schools}>
              <MultiSelectTrigger className="w-full">
                <MultiSelectValue placeholder="All Schools" overflowBehavior="scroll-when-open" />
              </MultiSelectTrigger>
              <MultiSelectContent
                onSearchChange={setSchoolSearch}
                search={{ placeholder: "Type to search schools..." }}
                searchValue={schoolSearch}
                useExternalSearch={true}
              >
                <MultiSelectGroup>
                  {schoolOptions.map((option) => (
                    <MultiSelectItem key={option.value} value={option.value}>
                      {option.label}
                    </MultiSelectItem>
                  ))}
                </MultiSelectGroup>
              </MultiSelectContent>
            </MultiSelect>
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="year" className="text-sm font-medium">
              Year
            </Label>
            <MultiSelect onValuesChange={setYears} values={years}>
              <MultiSelectTrigger className="w-full">
                <MultiSelectValue placeholder="All Years" overflowBehavior="scroll-when-open" />
              </MultiSelectTrigger>
              <MultiSelectContent>
                <MultiSelectGroup>
                  {yearOptions.map((option) => (
                    <MultiSelectItem key={option.value} value={option.value}>
                      {option.label}
                    </MultiSelectItem>
                  ))}
                </MultiSelectGroup>
              </MultiSelectContent>
            </MultiSelect>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content" className="text-sm font-medium">
          Content *
        </Label>
        <RichTextEditor
          placeholder="Type here..."
          onChangePlainText={setPlainTextContent}
          onChangeHTML={setHtmlContent}
          onChangeJSON={setContent}
        />
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
        {/* FIXME: idk why this works but it does, it's not a good solution.
        Needs to be changed to accomodate for both drawer and dialog. */}
        <DrawerClose asChild>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DrawerClose>
        <DrawerClose asChild>
          <Button
            type="submit"
            disabled={isInvalid}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Create Announcement
          </Button>
        </DrawerClose>
      </div>
    </form>
  )
}
