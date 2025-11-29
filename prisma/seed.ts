import { Prisma, PrismaClient } from "@/generated/client"
import { PrismaPg } from "@prisma/adapter-pg"
import "dotenv/config"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
})

// TODO: User faker to generate more realistic data

const userData: Prisma.UserCreateInput[] = [
  {
    id: "1",
    name: "Alice",
    firstName: "Alice",
    lastName: "Smith",
    email: "alice@prisma.io",
    // profile: {
    //   create: [{ bio: "I love databases!", avatarUrl: "https://example.com/alice.png" }],
    // },
  },
  {
    id: "2",
    name: "Bob",
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob@prisma.io",
    // profile: {
    //   create: [
    //     { bio: "I enjoy hiking and outdoor adventures.", avatarUrl: "https://example.com/bob.png" },
    //   ],
    // },
  },
]

const regionData: Prisma.RegionCreateInput[] = [
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

const yearLevelData: Prisma.YearLevelCreateInput[] = [
  { value: "year-9", label: "Year 9" },
  { value: "year-10", label: "Year 10" },
  { value: "year-11", label: "Year 11" },
  { value: "year-12", label: "Year 12" },
  { value: "year-13", label: "Year 13" },
]

const interestData: Prisma.InterestCreateInput[] = [
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

const announcementCategoryData: Prisma.AnnouncementCategoryCreateInput[] = [
  { value: "general", label: "General" },
  { value: "workshop", label: "Workshop" },
  { value: "academic-support", label: "Academic Support" },
  { value: "competition", label: "Competition" },
  { value: "social", label: "Social" },
  { value: "school-visit", label: "School Visit" },
  { value: "other", label: "Other" },
]

export async function main() {
  for (const user of userData) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    })
  }

  for (const region of regionData) {
    await prisma.region.upsert({
      where: { value: region.value },
      update: {},
      create: region,
    })
  }

  for (const yearLevel of yearLevelData) {
    await prisma.yearLevel.upsert({
      where: { value: yearLevel.value },
      update: {},
      create: yearLevel,
    })
  }

  for (const interest of interestData) {
    await prisma.interest.upsert({
      where: { value: interest.value },
      update: {},
      create: interest,
    })
  }

  for (const announcementCategory of announcementCategoryData) {
    await prisma.announcementCategory.upsert({
      where: { value: announcementCategory.value },
      update: {},
      create: announcementCategory,
    })
  }
}

main()
