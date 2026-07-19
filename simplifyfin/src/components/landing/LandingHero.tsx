import Link from "next/link";

export function LandingHero() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col justify-center overflow-hidden px-6 py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,_var(--wash)_0%,_transparent_55%),linear-gradient(165deg,_var(--bg)_0%,_var(--wash-deep)_100%)]"
      />
      <div
        aria-hidden
        className="sf-fade pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-[repeating-linear-gradient(180deg,transparent,transparent_31px,var(--line)_31px,var(--line)_32px)] opacity-30 lg:block"
      />

      <div className="relative mx-auto w-full max-w-5xl">
        <p className="sf-rise font-[family-name:var(--font-display)] text-5xl tracking-tight text-[var(--ink)] sm:text-7xl md:text-8xl">
          BudgetFreely
        </p>
        <div
          aria-hidden
          className="sf-rule mt-6 h-px w-24 bg-[var(--accent)] sm:w-32"
        />
        <h1 className="sf-rise-delay mt-8 max-w-xl text-xl leading-snug text-[var(--ink)] sm:text-2xl">
          See every EMI and subscription. Know which card paid.
        </h1>
        <p className="sf-rise-delay-2 mt-4 max-w-lg text-base text-[var(--muted)] sm:text-lg">
          Open-source personal finance built around recurring obligations and
          clear numbers — not another noisy dashboard.
        </p>
        <div className="sf-rise-delay-2 mt-10 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)]"
          >
            Sign in with Google
          </Link>
          <a
            href="#why"
            className="rounded-md border border-[var(--line)] bg-[var(--surface)]/80 px-5 py-2.5 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--ink)]/30"
          >
            See how it works
          </a>
        </div>
      </div>
    </section>
  );
}
