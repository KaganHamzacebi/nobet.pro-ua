import { createServerClient } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const signOut = () => {
  const origin = headers().get('origin');
  const supabase = createClient();
  supabase.auth.signOut();
  redirect(`${origin}`);
};

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        }
      }
    }
  );
}
