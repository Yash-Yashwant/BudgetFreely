import Link from "next/link";

export function LandingHeader() {
  return (
    <header className="relative z-10 border-b border-[var(--line)]/70">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-lg tracking-tight text-[var(--ink)]"
        >
          simplifyFIN
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <a
            href="#why"
            className="text-[var(--muted)] transition hover:text-[var(--ink)]"
          >
            Why
          </a>
          <Link
            href="/login"
            className="rounded-md bg-[var(--accent)] px-3.5 py-1.5 font-medium text-white transition hover:bg-[var(--accent-hover)]"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}
