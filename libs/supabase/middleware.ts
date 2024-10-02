import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import { NotificationType } from '../enums/NotificationType';

const protectedRoutes = ['/dashboard'];

const isProtectedRoute = (route: string) => {
  return protectedRoutes.some(r => route.startsWith(r));
};

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers
      }
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({
              request
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          }
        }
      }
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const user = await supabase.auth.getUser();
    const route = request.nextUrl.pathname;

    // Do not let user the go / route if logged in already
    if (route === '/' && !user.error) {
      return NextResponse.redirect(new URL(`/dashboard`, request.url));
    }
    // Unauthorized case
    else if (isProtectedRoute(route) && !user.data.user) {
      return NextResponse.redirect(new URL(`/?${NotificationType.Unauthorized}=true`, request.url));
    }

    return response;
  } catch (e) {
    console.log(e);
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers
      }
    });
  }
};
