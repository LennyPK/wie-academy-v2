/* eslint-disable no-console */

import { Prisma, PrismaClient } from "@/generated/client"
import { Role } from "@/lib/prisma/enums"
import { faker } from "@faker-js/faker"
import { PrismaPg } from "@prisma/adapter-pg"
import "dotenv/config"
import { announcementData } from "./seed/announcements"
import { announcementCategoryData, interestData, regionData, yearLevelData } from "./seed/constants"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
})

const userData: Prisma.UserCreateInput[] = [
  {
    id: faker.string.uuid(),
    name: "Alice Smith",
    firstName: "Alice",
    lastName: "Smith",
    email: "alice@prisma.io",
    role: Role.ADMIN,
  },
  {
    id: faker.string.uuid(),
    name: "Bob Johnson",
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob@prisma.io",
  },
]

export async function main() {
  console.log("starting to seed...")

  console.log("...seeding users...")
  for (const user of userData) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    })
  }

  console.log("...seeding regions...")
  for (const region of regionData) {
    await prisma.region.upsert({
      where: { value: region.value },
      update: {},
      create: region,
    })
  }

  console.log("...seeding year levels...")
  for (const yearLevel of yearLevelData) {
    await prisma.yearLevel.upsert({
      where: { value: yearLevel.value },
      update: {},
      create: yearLevel,
    })
  }

  console.log("...seeding interests...")
  for (const interest of interestData) {
    await prisma.interest.upsert({
      where: { value: interest.value },
      update: {},
      create: interest,
    })
  }

  console.log("...seeding announcement categories...")
  for (const announcementCategory of announcementCategoryData) {
    await prisma.announcementCategory.upsert({
      where: { value: announcementCategory.value },
      update: {},
      create: announcementCategory,
    })
  }

  console.log("...seeding announcements...")
  for (const announcement of announcementData) {
    await prisma.announcement.upsert({
      where: { id: announcement.id },
      update: {},
      create: announcement,
    })
  }

  console.log("...seeding finished.")
}

main()
