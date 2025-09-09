import { createBrowserClient } from '@supabase/ssr'

//creating an instance of the Supabase client
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}

// we can create a client instance like this:
// const supabase = createClient();
// why it is good? can be added in any client component to add stuff to our database does not require a sync await so its perfect for CSR
