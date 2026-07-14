import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user?.id;
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "OPERATOR";
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  providers: [], // Empty list for Edge Compatibility
} satisfies NextAuthConfig;
