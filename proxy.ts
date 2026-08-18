import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Routes under /studio that must stay reachable without a session.
const PUBLIC_STUDIO_PATHS = [
  "/studio/login",
  "/studio/forgot-password",
  "/studio/reset-password",
  "/studio/accept-invite",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/studio")) {
    return NextResponse.next();
  }

  const isPublicStudioPath = PUBLIC_STUDIO_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  if (isPublicStudioPath) {
    return NextResponse.next();
  }

  const session = getSessionCookie(request);
  if (!session) {
    const loginUrl = new URL("/studio/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/studio/:path*"],
};
