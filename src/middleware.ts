import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server'; // Import NextResponse

const isPublicRoute = createRouteMatcher(['/sign-in', '/sign-up']);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth(); // Get userId from auth object

  if (!isPublicRoute(req) && !userId) {
    // If route is not public and user is not signed in, redirect to sign in
    const signInUrl = new URL('/sign-in', req.url); // Assuming '/sign-in' is your sign-in page
    return NextResponse.redirect(signInUrl);
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
