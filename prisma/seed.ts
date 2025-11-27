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
    name: "Alice",
    email: "alice@prisma.io",
    // profile: {
    //   create: [{ bio: "I love databases!", avatarUrl: "https://example.com/alice.png" }],
    // },
  },
  {
    name: "Bob",
    email: "bob@prisma.io",
    // profile: {
    //   create: [
    //     { bio: "I enjoy hiking and outdoor adventures.", avatarUrl: "https://example.com/bob.png" },
    //   ],
    // },
  },
]

const regionData: Prisma.UserCreateInput[] = [
  { name: "Northland" },
  { name: "Auckland" },
  { name: "Waikato" },
  { name: "Bay of Plenty" },
  { name: "Gisborne" },
  { name: "Hawke's Bay" },
  { name: "Taranaki" },
  { name: "Manawatū-Whanganui" },
  { name: "Wellington" },
  { name: "Tasman" },
  { name: "Nelson" },
  { name: "Marlborough" },
  { name: "West Coast" },
  { name: "Canterbury" },
  { name: "Otago" },
  { name: "Southland" },
  { name: "N/A" },
]

const yearLevelData: Prisma.UserCreateInput[] = [
  { name: "Year 9" },
  { name: "Year 10" },
  { name: "Year 11" },
  { name: "Year 12" },
  { name: "Year 13" },
]

const approvalStatusData: Prisma.UserCreateInput[] = [
  { name: "pending" },
  { name: "approved" },
  { name: "declined" },
]

const interestData: Prisma.UserCreateInput[] = [
  { name: "Hardware" },
  { name: "Manufacturing" },
  { name: "Health Technology" },
  { name: "Construction" },
  { name: "Aerospace" },
  { name: "Complex Systems" },
  { name: "Robotics" },
  { name: "Artificial Intelligence" },
  { name: "Sustainability" },
  { name: "Electronics" },
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
      where: { name: region.name },
      update: {},
      create: region,
    })
  }

  for (const yearLevel of yearLevelData) {
    await prisma.yearLevel.upsert({
      where: { name: yearLevel.name },
      update: {},
      create: yearLevel,
    })
  }

  for (const approvalStatus of approvalStatusData) {
    await prisma.approvalStatus.upsert({
      where: { name: approvalStatus.name },
      update: {},
      create: approvalStatus,
    })
  }

  for (const interest of interestData) {
    await prisma.interest.upsert({
      where: { name: interest.name },
      update: {},
      create: interest,
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
