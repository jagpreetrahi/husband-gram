
import type { NextRequest } from 'next/server'
import { auth0 } from './lib/auth'
 
export default async function middleware(request: NextRequest) {
  return await auth0.middleware(request)
}
 
// Supports both a single string value or an array of matchers
export const config = {
  matcher:    ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
}