import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Define protected and public routes
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard')
  const isSignInRoute = request.nextUrl.pathname === '/signin'
  const isLandingPage = request.nextUrl.pathname === '/'

  // If user is authenticated and trying to access signin page, redirect to dashboard
  if (user && isSignInRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // If user is not authenticated and trying to access protected routes, redirect to signin
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/signin'
    return NextResponse.redirect(url)
  }

  // // Optional: Redirect root path to dashboard if user is authenticated
  // if (user && isLandingPage) {
  //   const url = request.nextUrl.clone()
  //   url.pathname = '/dashboard'
  //   return NextResponse.redirect(url)
  // }

  return supabaseResponse
}