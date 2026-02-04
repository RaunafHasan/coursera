import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CourseCard } from "@/components/course-card";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BookOpen } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/login");
  }

  const courses = await prisma.course.findMany({
    include: {
      contents: {
        orderBy: { order: 'asc' }
      },
      progress: {
        where: { userId: session.user.id }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const coursesWithProgress = courses.map((course: any) => {
    const totalContent = course.contents.length;
    const completedContent = course.progress.filter((p: any) => p.completed).length;
    const progress = totalContent > 0 ? Math.round((completedContent / totalContent) * 100) : 0;

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      imageUrl: course.imageUrl,
      contentCount: totalContent,
      progress
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Times New Roman', 'Tiro Bangla', serif" }}>
            Available Courses
          </h2>
        </div>

        {coursesWithProgress.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-20 h-20 mx-auto text-gray-400 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No courses available yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Check back soon for new learning opportunities!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coursesWithProgress.map((course: any) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
