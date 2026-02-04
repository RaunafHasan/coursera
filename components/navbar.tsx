"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "./ui/button"
import { BookOpen, LogOut, LayoutDashboard, ChevronDown } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const { data: session } = useSession()
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-[#056f80] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-[#056f80]" style={{ fontFamily: "'Times New Roman', serif" }}>
                EduLearn
              </span>
              <span className="text-xs text-gray-500 -mt-1">Learning Platform</span>
            </div>
          </Link>

          {/* Right Side */}
          <div className="flex items-center space-x-6">
            {session?.user ? (
              <>
                {/* Admin Dashboard Button */}
                {session.user.role === "ADMIN" && (
                  <Link href="/admin">
                    <Button variant="secondary" className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-[#056f80] text-white hover:bg-[#044d5a] shadow-md">
                      <LayoutDashboard className="w-4 h-4" />
                      <span className="font-medium">Admin Dashboard</span>
                    </Button>
                  </Link>
                )}
                
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-all border border-gray-200 hover:border-[#056f80] hover:shadow-md"
                  >
                    <div className="w-9 h-9 bg-[#056f80] rounded-full flex items-center justify-center text-white font-bold shadow-md">
                      {(session.user.name || session.user.email)?.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-semibold text-gray-900">{session.user.name || "User"}</span>
                      <span className="text-xs text-gray-500">{session.user.role === "ADMIN" ? "Administrator" : "Student"}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showUserMenu ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{session.user.name || "User"}</p>
                        <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                      </div>
                      
                      {session.user.role === "ADMIN" && (
                        <Link href="/admin" className="sm:hidden">
                          <button className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-700">
                            <LayoutDashboard className="w-4 h-4" />
                            <span className="text-sm">Admin Dashboard</span>
                          </button>
                        </Link>
                      )}
                      
                      <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="w-full px-4 py-2.5 text-left hover:bg-red-50 flex items-center space-x-3 text-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link href="/login">
                <Button className="px-6 py-2.5">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Close dropdown when clicking outside */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </nav>
  )
}
