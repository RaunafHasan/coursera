import { cn } from "@/lib/utils"

interface ProgressBarProps {
  progress: number
  className?: string
  showLabel?: boolean
}

export function ProgressBar({ progress, className, showLabel = true }: ProgressBarProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-2">
        {showLabel && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progress
          </span>
        )}
        <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
          {progress}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700 overflow-hidden shadow-inner">
        <div
          className="h-3 rounded-full bg-[#056f80] transition-all duration-500 ease-out shadow-lg"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
