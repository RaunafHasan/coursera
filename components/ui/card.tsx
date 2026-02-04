import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
        hover && "transition-all duration-300 hover:shadow-2xl hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("px-6 py-5 border-b border-gray-200 dark:border-gray-700", className)}>
      {children}
    </div>
  )
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("px-6 py-5", className)}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700", className)}>
      {children}
    </div>
  )
}
