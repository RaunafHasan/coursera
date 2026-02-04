import { authOptions } from "@/lib/auth"
import NextAuth from "next-auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

// Export the route config to avoid build errors
export const runtime = 'nodejs'
