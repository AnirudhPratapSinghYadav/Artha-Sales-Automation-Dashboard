import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Basic in-memory rate limiting map. 
// Note: In a true distributed Edge environment (like Vercel), this memory is scoped per-isolate 
// and will not be perfectly global without an external store like Redis (Upstash).
// However, it provides a baseline defense against single-node rapid bursts.
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100;

export default function proxy(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';

  // 1. Basic Rate Limiting (API Routes only to avoid blocking static assets)
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const now = Date.now();
    let limiter = rateLimitMap.get(ip);

    if (!limiter || now - limiter.lastReset > RATE_LIMIT_WINDOW_MS) {
      limiter = { count: 0, lastReset: now };
    }

    limiter.count++;
    rateLimitMap.set(ip, limiter);

    if (limiter.count > MAX_REQUESTS_PER_WINDOW) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': '60',
          'Content-Type': 'text/plain',
        },
      });
    }
  }

  // 2. Add Security Headers dynamically (Defense-in-depth along with next.config.ts)
  const response = NextResponse.next();
  
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Basic CSP - can be tightened as needed for production
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co; frame-src 'self' https://bookings.cloud.microsoft;"
  );

  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
