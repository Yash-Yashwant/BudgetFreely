import Link from "next/link";
import { redirect } from "next/navigation";
import { signInWithGoogle } from "@/app/(app)/auth-actions";
import { getSessionUser } from "@/lib/session";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const user = await getSessionUser();
  if (user) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const error = params.error;

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)]">
          simplifyFIN
        </p>
        <h1 className="mt-6 text-xl font-medium text-[var(--ink)]">
          Sign in
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Use Google — Supabase handles the OAuth flow. Magic link stays in the
          codebase for later.
        </p>

        {error ? (
          <p
            className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
            role="alert"
          >
            {error === "AccessDenied"
              ? "That Google account is not on the allowlist."
              : "Could not sign in. Check Supabase Google provider settings and try again."}
          </p>
        ) : null}

        <form action={signInWithGoogle} className="mt-8">
          <input
            type="hidden"
            name="callbackUrl"
            value={params.callbackUrl || "/dashboard"}
          />
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-md border border-[var(--line)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--ink)]/30"
          >
            <GoogleMark />
            Continue with Google
          </button>
        </form>

        <p className="mt-8 text-xs text-[var(--muted)]">
          Email magic link is parked for a later phase.{" "}
          <Link href="/" className="underline-offset-2 hover:underline">
            Back home
          </Link>
        </p>
      </div>
    </main>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 48 48">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16.2 19 14 24 14c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.1 26.8 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.6 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l.1.1 6.2 5.2C39.2 37.3 44 32 44 24c0-1.3-.1-2.5-.4-3.5z"
      />
    </svg>
  );
}
