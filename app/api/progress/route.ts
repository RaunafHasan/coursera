import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { contentId, completed } = body

    const progress = await prisma.progress.upsert({
      where: {
        userId_contentId: {
          userId: session.user.id,
          contentId
        }
      },
      update: {
        completed
      },
      create: {
        userId: session.user.id,
        contentId,
        courseId: body.courseId,
        completed
      }
    })

    return NextResponse.json(progress)
  } catch (error) {
    console.error("Error updating progress:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
