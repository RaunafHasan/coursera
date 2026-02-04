import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { google } from "googleapis"

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY
})

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { youtubeUrl } = await req.json()

    if (!youtubeUrl) {
      return NextResponse.json({ error: "YouTube URL is required" }, { status: 400 })
    }

    // Extract video ID from URL
    const videoIdMatch = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
    if (!videoIdMatch) {
      return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 })
    }

    const videoId = videoIdMatch[1]

    // Fetch video details from YouTube
    const response = await youtube.videos.list({
      part: ["snippet"],
      id: [videoId]
    })

    if (!response.data.items || response.data.items.length === 0) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    const videoTitle = response.data.items[0].snippet?.title || "Untitled Video"

    // Get current max order
    const { id } = await params

    const contents = await prisma.content.findMany({
      where: { courseId: id },
      orderBy: { order: "desc" },
      take: 1
    })

    const order = contents.length > 0 ? contents[0].order + 1 : 0

    // Create content
    const content = await prisma.content.create({
      data: {
        title: videoTitle,
        type: "VIDEO",
        youtubeUrl: youtubeUrl,
        order: order,
        courseId: id
      }
    })

    return NextResponse.json({ success: true, content })
  } catch (error: any) {
    console.error("Error adding video:", error)
    
    if (error.message?.includes("quota")) {
      return NextResponse.json(
        { error: "YouTube API quota exceeded. Please try again later." },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: "Failed to add video" },
      { status: 500 }
    )
  }
}
