import { Prisma } from "@/generated/client"

export const regionData: Prisma.RegionCreateInput[] = [
  { value: "northland-region", label: "Northland" },
  { value: "auckland-region", label: "Auckland" },
  { value: "waikato-region", label: "Waikato" },
  { value: "bay-of-plenty-region", label: "Bay of Plenty" },
  { value: "gisborne-region", label: "Gisborne" },
  { value: "hawkes-bay-region", label: "Hawke's Bay" },
  { value: "taranaki-region", label: "Taranaki" },
  { value: "manawatu-whanganui-region", label: "Manawatū-Whanganui" },
  { value: "wellington-region", label: "Wellington" },
  { value: "tasman-region", label: "Tasman" },
  { value: "nelson-region", label: "Nelson" },
  { value: "marlborough-region", label: "Marlborough" },
  { value: "west-coast-region", label: "West Coast" },
  { value: "canterbury-region", label: "Canterbury" },
  { value: "otago-region", label: "Otago" },
  { value: "southland-region", label: "Southland" },
  { value: "area-outside-region", label: "Area Outside Region" },
]

export const yearLevelData: Prisma.YearLevelCreateInput[] = [
  { value: "year-9", label: "Year 9" },
  { value: "year-10", label: "Year 10" },
  { value: "year-11", label: "Year 11" },
  { value: "year-12", label: "Year 12" },
  { value: "year-13", label: "Year 13" },
]

export const interestData: Prisma.InterestCreateInput[] = [
  { value: "aerospace", label: "Aerospace" },
  { value: "artificial-intelligence", label: "Artificial Intelligence" },
  { value: "complex-systems", label: "Complex Systems" },
  { value: "construction", label: "Construction" },
  { value: "electronics", label: "Electronics" },
  { value: "hardware", label: "Hardware" },
  { value: "health-technology", label: "Health Technology" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "robotics", label: "Robotics" },
  { value: "sustainability", label: "Sustainability" },
]

export const announcementCategoryData: Prisma.AnnouncementCategoryCreateInput[] = [
  { value: "general", label: "General" },
  { value: "workshop", label: "Workshop" },
  { value: "academic-support", label: "Academic Support" },
  { value: "competition", label: "Competition" },
  { value: "social", label: "Social" },
  { value: "school-visit", label: "School Visit" },
  { value: "other", label: "Other" },
]
