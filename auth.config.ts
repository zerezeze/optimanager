import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtectedRoute =
        nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/clientes") ||
        nextUrl.pathname.startsWith("/consultas") ||
        nextUrl.pathname.startsWith("/usuarios");

      if (isProtectedRoute) {
        if (!isLoggedIn) return false; // Redirect unauthenticated users to login page
        
        // Protect /usuarios: only ADMIN role is permitted
        if (nextUrl.pathname.startsWith("/usuarios")) {
          const userRole = auth.user?.role;
          if (userRole !== "ADMIN") {
            // Redirect operator back to dashboard
            return Response.redirect(new URL("/dashboard", nextUrl));
          }
        }
        
        return true;
      }

      if (isLoggedIn && nextUrl.pathname === "/login") {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
  },
  providers: [], // Empty list for Edge Compatibility
} satisfies NextAuthConfig;
