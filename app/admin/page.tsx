import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { AdminCourseList } from "@/components/admin/admin-course-list"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold mb-2 text-[#056f80]">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage courses and content for your e-learning platform
          </p>
        </div>
        
        <AdminCourseList />
      </div>
    </div>
  )
}
