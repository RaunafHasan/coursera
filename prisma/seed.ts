import 'dotenv/config'
// @ts-ignore
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import bcrypt from "bcryptjs"

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
// @ts-ignore
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Seeding database...")

  // Create admin user
  const adminPassword = await bcrypt.hash("Naeem678", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {
      password: adminPassword,
      role: "ADMIN"
    },
    create: {
      email: "admin@gmail.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN"
    }
  })
  console.log("✅ Created admin user:", admin.email)

  // Create regular user
  const userPassword = await bcrypt.hash("user123", 10)
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      name: "Demo User",
      password: userPassword,
      role: "USER"
    }
  })
  console.log("✅ Created demo user:", user.email)

  // Create sample courses
  const course1 = await prisma.course.create({
    data: {
      title: "Web Development Fundamentals",
      description: "Learn the basics of web development including HTML, CSS, and JavaScript. This comprehensive course will take you from beginner to confident web developer.",
      imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
      contents: {
        create: [
          {
            title: "Introduction to HTML",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=qz0aGYrrlhU",
            order: 0
          },
          {
            title: "CSS Styling Basics",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=OXGznpKZ_sA",
            order: 1
          },
          {
            title: "JavaScript Fundamentals",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
            order: 2
          }
        ]
      }
    }
  })
  console.log("✅ Created course:", course1.title)

  const course2 = await prisma.course.create({
    data: {
      title: "React for Beginners",
      description: "Master React.js from scratch. Build modern, responsive web applications with the most popular JavaScript library.",
      imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
      contents: {
        create: [
          {
            title: "React Introduction",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=SqcY0GlETPk",
            order: 0
          },
          {
            title: "Components and Props",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=QFaFIcGhPoM",
            order: 1
          }
        ]
      }
    }
  })
  console.log("✅ Created course:", course2.title)

  const course3 = await prisma.course.create({
    data: {
      title: "Python Programming",
      description: "Learn Python from the ground up. Perfect for beginners and experienced programmers looking to add Python to their skillset.",
      imageUrl: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800",
      contents: {
        create: [
          {
            title: "Python Basics",
            type: "VIDEO",
            youtubeUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
            order: 0
          }
        ]
      }
    }
  })
  console.log("✅ Created course:", course3.title)

  console.log("🎉 Seeding completed!")
  console.log("\n📝 Demo Credentials:")
  console.log("Admin: admin@gmail.com / Naeem678")
  console.log("User: user@example.com / user123")
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
