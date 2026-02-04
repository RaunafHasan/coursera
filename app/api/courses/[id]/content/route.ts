import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const runtime = 'nodejs'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, type, youtubeUrl, playlistId, order } = body

    if (!title || !type || !youtubeUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const content = await prisma.content.create({
      data: {
        courseId: id,
        title,
        type,
        youtubeUrl,
        playlistId,
        order
      }
    })

    return NextResponse.json(content, { status: 201 })
  } catch (error) {
    console.error("Error creating content:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const contents = await prisma.content.findMany({
      where: { courseId: id },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(contents)
  } catch (error) {
    console.error("Error fetching contents:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
