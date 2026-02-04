import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost"
  size?: "sm" | "md" | "lg"
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const baseStyles = "font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    
    const variants = {
      primary: "bg-[#056f80] hover:bg-[#044d5a] text-white shadow-lg hover:shadow-xl focus:ring-[#056f80]",
      secondary: "bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 focus:ring-gray-400",
      danger: "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500",
      ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-400"
    }
    
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg"
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"
