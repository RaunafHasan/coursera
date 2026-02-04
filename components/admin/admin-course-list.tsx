"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Video, List } from "lucide-react"
import Link from "next/link"

interface Course {
  id: string
  title: string
  description: string
  imageUrl?: string
  contentCount: number
}

export function AdminCourseList() {
  const [courses, setCourses] = useState<Course[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: ""
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses")
      if (res.ok) {
        const data = await res.json()
        setCourses(data)
      }
    } catch (error) {
      console.error("Error fetching courses:", error)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingCourse ? `/api/courses/${editingCourse.id}` : "/api/courses"
      const method = editingCourse ? "PUT" : "POST"
      
      const dataToSend = {
        ...formData,
        imageUrl: imagePreview || formData.imageUrl
      }
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend)
      })

      if (res.ok) {
        setShowCreateModal(false)
        setEditingCourse(null)
        setFormData({ title: "", description: "", imageUrl: "" })
        fetchCourses()
      }
    } catch (error) {
      console.error("Error saving course:", error)
    }
  }

  const handleEdit = (course: Course) => {
    setEditingCourse(course)
    setFormData({
      title: course.title,
      description: course.description,
      imageUrl: course.imageUrl || ""
    })
    setShowCreateModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return
    
    try {
      const res = await fetch(`/api/courses/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchCourses()
      }
    } catch (error) {
      console.error("Error deleting course:", error)
    }
  }

  const handleCloseModal = () => {
    setShowCreateModal(false)
    setEditingCourse(null)
    setFormData({ title: "", description: "", imageUrl: "" })
    setImageFile(null)
    setImagePreview("")
  }

  return (
    <div>
      <div className="mb-6">
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Course
        </Button>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <h2 className="text-2xl font-bold">
                {editingCourse ? "Edit Course" : "Create New Course"}
              </h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Course Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter course title"
                  required
                />
                
                <Textarea
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter course description"
                  rows={4}
                  required
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Image (optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-[#056f80] focus:ring-2 focus:ring-[#056f80]/20 outline-none"
                  />
                  {imagePreview && (
                    <div className="mt-3">
                      <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingCourse ? "Update Course" : "Create Course"}
                  </Button>
                  <Button type="button" variant="secondary" onClick={handleCloseModal}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Course List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} hover>
            <div className="relative h-48 bg-[#056f80]">
              {course.imageUrl ? (
                <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Video className="w-16 h-16 text-white opacity-80" />
                </div>
              )}
            </div>
            <CardContent className="pt-5">
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                {course.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                {course.description}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {course.contentCount} lessons
              </p>
              
              <div className="flex gap-2">
                <Link href={`/admin/courses/${course.id}`} className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full">
                    <List className="w-4 h-4 mr-2" />
                    Manage Content
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(course)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(course.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-20">
          <Video className="w-20 h-20 mx-auto text-gray-400 mb-4" />
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            No courses yet
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first course to get started
          </p>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Course
          </Button>
        </div>
      )}
    </div>
  )
}
