import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export class AuthRequiredError extends Error {
  constructor() {
    super("Authentication required");
    this.name = "AuthRequiredError";
  }
}

export class AccessDeniedError extends Error {
  constructor(message = "AccessDenied") {
    super(message);
    this.name = "AccessDeniedError";
  }
}

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

export type AppUserInput = {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
};

export async function ensureAppUser(input: AppUserInput) {
  const email = input.email?.toLowerCase();
  if (!email) {
    throw new AccessDeniedError("Email required");
  }

  const allowlist = parseAllowlist();
  if (allowlist && !allowlist.has(email)) {
    throw new AccessDeniedError("AccessDenied");
  }

  await prisma.user.upsert({
    where: { id: input.id },
    create: {
      id: input.id,
      email,
      name: input.name,
      image: input.image,
      emailVerified: new Date(),
    },
    update: {
      email,
      name: input.name ?? undefined,
      image: input.image ?? undefined,
    },
  });
}

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireUserId(): Promise<string> {
  const user = await getSessionUser();
  if (!user?.id || !user.email) {
    throw new AuthRequiredError();
  }

  await ensureAppUser({
    id: user.id,
    email: user.email,
    name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
    image: user.user_metadata?.avatar_url ?? null,
  });

  return user.id;
}
