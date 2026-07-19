import type { NextAuthConfig } from "next-auth";

function parseAllowlist(): Set<string> | null {
  const raw = process.env.AUTH_EMAIL_ALLOWLIST?.trim();
  if (!raw) return null;
  return new Set(
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );
}

/**
 * Edge-compatible Auth.js config (no Prisma / Nodemailer Node APIs).
 * Full providers + adapter live in auth.ts for Node runtimes.
 */
export const authConfig = {
  providers: [],
  pages: {
    signIn: "/login",
    verifyRequest: "/login/check-email",
    error: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user }) {
      const allowlist = parseAllowlist();
      if (!allowlist) return true;
      const email = user.email?.toLowerCase();
      if (!email) return false;
      return allowlist.has(email);
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = !!auth?.user;
      const isPublic =
        pathname === "/" ||
        pathname.startsWith("/login") ||
        pathname.startsWith("/api/auth");

      if (isPublic) return true;
      return isLoggedIn;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
