import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

//creating a server side Supabase instance
export async function createClient() {
  const cookieStore = await cookies() // creating a cookie store

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}


// in order to use the server client, you need to call the createClient function:
// const supabase = await createClient();