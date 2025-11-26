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

export async function main() {
  for (const user of userData) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    })
  }
}

main()
