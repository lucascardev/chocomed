import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define which routes are protected
const isProtectedRoute = createRouteMatcher([
  '/clube(.*)',
  '/admin(.*)',
  '/api/orders(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.[\\w]+$).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
