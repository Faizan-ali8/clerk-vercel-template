import { clerkMiddleware, createRouteMatcher, NextResponse } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/about']);

const CLERK_DEBUG = process.env.CLERK_DEBUG === 'true'; //Added for conditional logging

export default clerkMiddleware(async (auth, req) => {
  try {
    if (CLERK_DEBUG) console.log('Middleware: Incoming request for:', req.url);

    if (!isPublicRoute(req)) {
      if (CLERK_DEBUG) console.log('Middleware: Route is protected, calling auth.protect()');
      await auth.protect();
      if (CLERK_DEBUG) console.log('Middleware: auth.protect() successful');
    } else {
       if (CLERK_DEBUG) console.log('Middleware: Route is public:', req.url);
    }

    // Important: Ensure you're returning a NextResponse.next() if everything is ok
    return NextResponse.next();

  } catch (error: any) {
    console.error('Middleware Error:', error.message, error.stack);

    // Handle authentication errors specifically.  This is CRUCIAL.
    if (error.message.includes('Unauthorized') || error.message.includes('Authentication required')) {
        return NextResponse.redirect(new URL('/sign-in', req.url)); // Or wherever your sign-in page is
    }

    // For other errors, you might want to show a generic error page
    return new NextResponse('Internal Server Error', { status: 500 });
  }
});

export const config = {
  matcher: [
    /*
      More readable and maintainable matcher.  Consider simplifying if possible.
      This version should be equivalent to yours, but easier to understand.
    */
    '/((?!_next/static|_next/image|favicon.ico).*)', // Exclude static, image, and favicon
    '/api(.*)',
    '/trpc(.*)',
  ],
};