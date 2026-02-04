import { Card, CardContent, CardFooter } from "./ui/card"
import { ProgressBar } from "./ui/progress-bar"
import Link from "next/link"
import { BookOpen, Clock } from "lucide-react"

interface CourseCardProps {
  id: string
  title: string
  description: string
  imageUrl?: string
  progress: number
  contentCount: number
}

export function CourseCard({ id, title, description, imageUrl, progress, contentCount }: CourseCardProps) {
  return (
    <Link href={`/courses/${id}`}>
      <Card hover className="h-full overflow-hidden">
        <div className="relative h-64 bg-[#056f80]">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <BookOpen className="w-20 h-20 text-white opacity-80" />
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
            <h3 className="text-lg font-bold text-white mb-2 line-clamp-2" style={{ fontFamily: "'Times New Roman', 'Tiro Bangla', serif" }}>
              {title}
            </h3>
            <div className="flex items-center justify-between text-white/90 text-sm">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                {contentCount} lessons
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
