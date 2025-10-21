import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const NEXTAUTH_SECRET = "secret";

export async function middleware(req: NextRequest) {
 const { nextUrl } = req;
 const pathname = nextUrl.pathname;

 if (
  pathname.startsWith("/_next/") ||
  pathname.startsWith("/favicon.ico") ||
  pathname.includes(".")
 ) {
  return NextResponse.next();
 }

 const publicPaths = [
  "/login",
  "/verification",
  "/api/auth", // make sure your next-auth routes are reachable
  "/api/public",
  "/"
 ];
 if (publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
  return NextResponse.next();
 }

 const token = await getToken({ req, secret: NEXTAUTH_SECRET });
 const hasFinalToken = !!(token as Record<string, string>)?.accessToken;

 if (!hasFinalToken) {
  const loginUrl = new URL("/login", req.nextUrl.origin);
  loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(loginUrl);
 }

 return NextResponse.next();
}


export const config = {
 matcher: [
  "/cases"
 ],
};
