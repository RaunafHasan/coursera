"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProgressBar } from "@/components/ui/progress-bar"
import { PlayCircle, CheckCircle, ArrowLeft, List } from "lucide-react"

interface Content {
  id: string
  title: string
  type: string
  youtubeUrl: string
  order: number
}

interface Course {
  id: string
  title: string
  description: string
  contents: Content[]
  progress: { contentId: string; completed: boolean }[]
}

export default function CoursePage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [course, setCourse] = useState<Course | null>(null)
  const [selectedContent, setSelectedContent] = useState<Content | null>(null)
  const [loading, setLoading] = useState(true)
  const [player, setPlayer] = useState<any>(null)
  const [videoProgress, setVideoProgress] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    fetchCourse()
    
    // Load YouTube IFrame API
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    
    // @ts-ignore
    window.onYouTubeIframeAPIReady = () => {
      console.log('YouTube API Ready')
    }
  }, [id])

  useEffect(() => {
    // @ts-ignore
    if (selectedContent && (window as any).YT) {
      // Don't reinitialize if already completed to prevent flicker
      // @ts-ignore
      if (!isContentCompleted(selectedContent.id)) {
        initializePlayer()
      }
    }
  }, [selectedContent])

  const initializePlayer = () => {
    const videoId = selectedContent?.youtubeUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]
    
    if (!videoId) return

    if (player) {
      player.destroy()
    }

    // @ts-ignore
    const newPlayer = new window.YT.Player('youtube-player', {
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        enablejsapi: 1
      },
      events: {
        onStateChange: onPlayerStateChange,
        onReady: onPlayerReady
      }
    })
    
    setPlayer(newPlayer)
  }

  const onPlayerReady = (event: any) => {
    // Start tracking progress
    const interval = setInterval(() => {
      if (event.target && selectedContent) {
        const currentTime = event.target.getCurrentTime()
        const duration = event.target.getDuration()
        
        if (duration > 0) {
          const progress = (currentTime / duration) * 100
          
          // Auto-complete when 50% watched
          if (progress >= 50 && !isContentCompleted(selectedContent.id)) {
            markAsCompleted(selectedContent.id)
          }
          
          setVideoProgress(prev => ({
            ...prev,
            [selectedContent.id]: progress
          }))
        }
      }
    }, 2000) // Check every 2 seconds

    // @ts-ignore
    window.videoProgressInterval = interval
  }

  const onPlayerStateChange = (event: any) => {
    // Clean up interval when video ends or is paused
    if (event.data === 0 || event.data === 2) {
      // @ts-ignore
      if (window.videoProgressInterval) {
        // @ts-ignore
        clearInterval(window.videoProgressInterval)
      }
    }
  }

  const markAsCompleted = async (contentId: string) => {
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentId,
          courseId: id,
          completed: true
        })
      })
      
      fetchCourse()
    } catch (error) {
      console.error("Error updating progress:", error)
    }
  }

  useEffect(() => {
    fetchCourse()
  }, [id])

  const fetchCourse = async () => {
    try {
      const res = await fetch(`/api/courses/${id}`)
      if (res.ok) {
        const data = await res.json()
        setCourse(data)
        if (data.contents.length > 0) {
          setSelectedContent(data.contents[0])
        }
      }
    } catch (error) {
      console.error("Error fetching course:", error)
    } finally {
      setLoading(false)
    }
  }

  const isContentCompleted = (contentId: string) => {
    if (!course?.progress) return false
    const progressArray = Array.isArray(course.progress) ? course.progress : []
    return progressArray.some((p: any) => p.contentId === contentId && p.completed)
  }

  const getYoutubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]
    return videoId || ''
  }

  const calculateProgress = () => {
    if (!course || course.contents.length === 0) return 0
    const progressArray = Array.isArray(course.progress) ? course.progress : []
    const completed = progressArray.filter((p: any) => p.completed).length
    return Math.round((completed / course.contents.length) * 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-cyan-50 to-blue-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-cyan-50 to-blue-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-gray-600">Course not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="mb-2 w-fit px-2 py-1 h-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-0">
            {/* Video Player */}
            <div className="lg:col-span-3 flex flex-col min-h-0">
              <Card className="flex-1 flex flex-col min-h-0">
                <CardContent className="p-0 flex-1 flex flex-col">
                  {selectedContent ? (
                    <div className="flex-1 min-h-0 w-full aspect-video" id="youtube-player"></div>
                  ) : null}
                  {selectedContent && (
                    <div className="p-4 border-t">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Times New Roman', 'Tiro Bangla', serif" }}>
                          {selectedContent.title}
                        </h2>
                        {isContentCompleted(selectedContent.id) && (
                          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-semibold">Completed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Content List */}
            <div className="lg:col-span-2 flex flex-col min-h-0">
              <Card className="lg:h-full lg:flex lg:flex-col border-2 border-gray-200 shadow-xl">
              <CardHeader className="lg:flex-shrink-0 bg-[#056f80] text-white rounded-t-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <List className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold" style={{ fontFamily: "'Times New Roman', 'Tiro Bangla', serif" }}>
                      Course Content
                    </h3>
                    <p className="text-lg text-white/80 mt-1" style={{ fontFamily: "'Times New Roman', 'Tiro Bangla', serif" }}>
                      {course.contents.length} lessons
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 lg:flex-1 lg:overflow-y-auto bg-gray-50">
                <div className="divide-y divide-gray-100">
                  {course.contents.map((content, index) => (
                    <button
                      key={content.id}
                      onClick={() => setSelectedContent(content)}
                      className={`w-full text-left p-4 transition-all duration-200 group relative ${
                        selectedContent?.id === content.id 
                          ? "bg-gradient-to-r from-orange-500 to-amber-500 border-l-4 border-orange-700 shadow-lg" 
                          : "hover:bg-white hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isContentCompleted(content.id)
                              ? "bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-200"
                              : selectedContent?.id === content.id
                              ? "bg-gradient-to-br from-orange-600 to-amber-600 shadow-lg shadow-orange-200"
                              : "bg-gray-200 group-hover:bg-[#056f80]"
                          }`}>
                            {isContentCompleted(content.id) ? (
                              <CheckCircle className="w-5 h-5 text-white" />
                            ) : (
                              <PlayCircle className={`w-5 h-5 ${
                                selectedContent?.id === content.id ? "text-white" : "text-gray-500 group-hover:text-white"
                              }`} />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              selectedContent?.id === content.id
                                ? "bg-white/30 text-white backdrop-blur-sm"
                                : "bg-gray-300 text-gray-700 group-hover:bg-[#056f80] group-hover:text-white"
                            }`}>
                              Lesson {index + 1}
                            </span>
                            {content.type === "PLAYLIST" && (
                              <span className="text-xs px-2 py-0.5 bg-[#056f80]/20 text-[#056f80] rounded-full font-medium">
                                Playlist
                              </span>
                            )}
                            {isContentCompleted(content.id) && (
                              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Watched
                              </span>
                            )}
                          </div>
                          <p className={`text-base font-semibold leading-snug ${
                            selectedContent?.id === content.id ? "text-white" : "text-gray-900"
                          }`} style={{ fontFamily: "'Times New Roman', 'Tiro Bangla', serif" }}>
                            {content.title}
                          </p>
                        </div>
                        {selectedContent?.id === content.id && (
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-lg" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
