import Link from "next/link";

export function LandingCta() {
  return (
    <section className="border-t border-[var(--line)]">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)] sm:text-4xl">
          Ready when you are
        </h2>
        <p className="mt-3 max-w-lg text-[var(--muted)]">
          Private beta while we finish bank sync and recurring detection. Sign
          in with Google to get in.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-flex rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)]"
        >
          Sign in with Google
        </Link>
      </div>
    </section>
  );
}
