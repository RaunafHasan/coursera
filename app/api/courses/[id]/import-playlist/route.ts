import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { google } from "googleapis"

// @ts-ignore
const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY
})

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
    const { playlistUrl } = body

    if (!playlistUrl) {
      return NextResponse.json({ error: "Playlist URL is required" }, { status: 400 })
    }

    // Extract playlist ID from URL
    const playlistIdMatch = playlistUrl.match(/[?&]list=([^&]+)/)
    if (!playlistIdMatch) {
      return NextResponse.json({ error: "Invalid playlist URL" }, { status: 400 })
    }

    const playlistId = playlistIdMatch[1]

    if (!process.env.YOUTUBE_API_KEY) {
      return NextResponse.json(
        { error: "YouTube API key not configured. Please add YOUTUBE_API_KEY to your .env file" },
        { status: 500 }
      )
    }

    // Get current content count for ordering
    const existingContent = await prisma.content.findMany({
      where: { courseId: id },
      orderBy: { order: 'desc' },
      take: 1
    })

    let order = existingContent.length > 0 ? existingContent[0].order + 1 : 0

    // Fetch playlist items
    let allVideos: any[] = []
    let nextPageToken: string | undefined = undefined

    do {
      // @ts-ignore
      const response: any = await youtube.playlistItems.list({
        part: ["snippet"],
        playlistId: playlistId,
        maxResults: 50,
        pageToken: nextPageToken
      })

      if (response.data.items) {
        allVideos = allVideos.concat(response.data.items)
      }

      nextPageToken = response.data.nextPageToken || undefined
    } while (nextPageToken)

    if (allVideos.length === 0) {
      return NextResponse.json({ error: "No videos found in playlist" }, { status: 404 })
    }

    // Create content entries for each video
    const createdContent = []
    for (const video of allVideos) {
      const videoId = video.snippet?.resourceId?.videoId
      const title = video.snippet?.title
      
      if (videoId && title) {
        const content = await prisma.content.create({
          data: {
            courseId: id,
            title: title,
            type: "VIDEO",
            youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
            playlistId: playlistId,
            order: order++
          }
        })
        createdContent.push(content)
      }
    }

    return NextResponse.json({
      message: `Successfully added ${createdContent.length} videos from playlist`,
      count: createdContent.length,
      content: createdContent
    }, { status: 201 })
  } catch (error: any) {
    console.error("Error importing playlist:", error)
    
    if (error.message?.includes("quotaExceeded")) {
      return NextResponse.json(
        { error: "YouTube API quota exceeded. Please try again later." },
        { status: 429 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
