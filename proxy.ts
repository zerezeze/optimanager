import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export const proxy = NextAuth(authConfig).auth;

export const config = {
  // Intercept all paths except static files, api routes, images, and favicon
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
