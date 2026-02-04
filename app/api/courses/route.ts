import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const runtime = 'nodejs'

// @ts-ignore
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const courses = await prisma.course.findMany({
      include: {
        contents: {
          orderBy: { order: 'asc' }
        },
        progress: session.user.id ? {
          where: { userId: session.user.id }
        } : false
      },
      orderBy: { createdAt: 'desc' }
    })

    // @ts-ignore
    const coursesWithProgress = courses.map((course: any) => {
      const totalContent = course.contents.length
      // @ts-ignore
      const completedContent = course.progress ? course.progress.filter((p: any) => p.completed).length : 0
      const progress = totalContent > 0 ? Math.round((completedContent / totalContent) * 100) : 0

      return {
        id: course.id,
        title: course.title,
        description: course.description,
        imageUrl: course.imageUrl,
        contentCount: totalContent,
        progress
      }
    })

    return NextResponse.json(coursesWithProgress)
  } catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, imageUrl } = body

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        imageUrl
      }
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error("Error creating course:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
