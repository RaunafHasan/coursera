"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, ArrowLeft, Video, List as ListIcon } from "lucide-react"

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
}

export default function AdminCoursePage() {
  const { id } = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPlaylistModal, setShowPlaylistModal] = useState(false)
  const [playlistUrl, setPlaylistUrl] = useState("")
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState<string>("")
  const [videoUrl, setVideoUrl] = useState("")
  const [addingVideo, setAddingVideo] = useState(false)
  const [addVideoError, setAddVideoError] = useState<string | null>(null)

  useEffect(() => {
    fetchCourse()
  }, [id])

  const fetchCourse = async () => {
    try {
      const res = await fetch(`/api/courses/${id}`)
      if (res.ok) {
        const data = await res.json()
        setCourse(data)
      }
    } catch (error) {
      console.error("Error fetching course:", error)
    }
  }

  const handleAddVideo = async () => {
    if (!videoUrl.trim()) return
    
    setAddingVideo(true)
    setAddVideoError(null)
    
    try {
      const res = await fetch(`/api/courses/${id}/add-video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ youtubeUrl: videoUrl })
      })

      const data = await res.json()

      if (res.ok) {
        alert(`Video added: ${data.content.title}`)
        setShowAddModal(false)
        setVideoUrl("")
        fetchCourse()
      } else {
        setAddVideoError(data.error || "Failed to add video")
      }
    } catch (error) {
      console.error("Error adding video:", error)
      setAddVideoError("Failed to add video")
    } finally {
      setAddingVideo(false)
    }
  }

  const handleImportPlaylist = async (e: React.FormEvent) => {
    e.preventDefault()
    setImporting(true)
    setImportError("")

    try {
      const res = await fetch(`/api/courses/${id}/import-playlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playlistUrl })
      })

      const data = await res.json()

      if (!res.ok) {
        setImportError(data.error || "Failed to import playlist")
        setImporting(false)
        return
      }

      setShowPlaylistModal(false)
      setPlaylistUrl("")
      setImportError("")
      fetchCourse()
      alert(`Successfully imported ${data.count} videos from the playlist!`)
    } catch (error) {
      setImportError("An error occurred while importing the playlist")
    } finally {
      setImporting(false)
    }
  }

  const handleDelete = async (contentId: string) => {
    if (!confirm("Are you sure you want to delete this content?")) return
    
    try {
      const res = await fetch(`/api/courses/${id}/content/${contentId}`, {
        method: "DELETE"
      })

      if (res.ok) {
        alert("Content deleted successfully")
        fetchCourse()
      } else {
        alert("Failed to delete content")
      }
    } catch (error) {
      console.error("Error deleting content:", error)
      alert("Failed to delete content")
    }
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-cyan-50 to-blue-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-cyan-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
          <p className="text-gray-600">{course.description}</p>
        </div>

        <div className="mb-6 flex gap-3">
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Single Video
          </Button>
          <Button onClick={() => setShowPlaylistModal(true)} variant="secondary">
            <ListIcon className="w-4 h-4 mr-2" />
            Import Playlist
          </Button>
        </div>

        {/* Add Video Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <h2 className="text-2xl font-bold">Add Single Video</h2>
                <p className="text-gray-600 mt-2">
                  Paste a YouTube video URL to automatically add it with its title
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    label="YouTube Video URL"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    disabled={addingVideo}
                  />
                  
                  {addVideoError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800 text-sm">{addVideoError}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button 
                      onClick={handleAddVideo}
                      disabled={addingVideo || !videoUrl.trim()}
                    >
                      {addingVideo ? "Adding..." : "Add Video"}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setShowAddModal(false)
                        setVideoUrl("")
                        setAddVideoError(null)
                      }}
                      disabled={addingVideo}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Import Playlist Modal */}
        {showPlaylistModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <h2 className="text-2xl font-bold">Import YouTube Playlist</h2>
                <p className="text-gray-600 mt-2">
                  Paste a YouTube playlist URL to automatically import all videos
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    label="Playlist URL"
                    value={playlistUrl}
                    onChange={(e) => setPlaylistUrl(e.target.value)}
                    placeholder="https://youtube.com/playlist?list=..."
                    disabled={importing}
                  />
                  
                  {importError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800 text-sm">{importError}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button 
                      onClick={handleImportPlaylist}
                      disabled={importing || !playlistUrl.trim()}
                    >
                      {importing ? "Importing..." : "Import Videos"}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setShowPlaylistModal(false)
                        setPlaylistUrl("")
                        // @ts-ignore
                        setImportError("")
                      }}
                      disabled={importing}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Content List */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ListIcon className="w-5 h-5 text-indigo-600" />
              Course Content ({course.contents.length} items)
            </h2>
          </CardHeader>
          <CardContent>
            {course.contents.length === 0 ? (
              <div className="text-center py-12">
                <Video className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">No content added yet</p>
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Content
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {course.contents.map((content, index) => (
                  <div
                    key={content.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {content.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {content.type === "PLAYLIST" ? "Playlist" : "Video"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(content.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
