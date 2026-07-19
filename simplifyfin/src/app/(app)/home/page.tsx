import Link from "next/link";
import { getSessionUser } from "@/lib/session";

export default async function HomePage() {
  const user = await getSessionUser();
  const name =
    (user?.user_metadata?.full_name as string | undefined) ??
    (user?.user_metadata?.name as string | undefined) ??
    user?.email?.split("@")[0] ??
    "there";

  return (
    <div className="space-y-10">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-[var(--accent)]">
          You&apos;re in
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)] sm:text-4xl">
          Welcome, {name}
        </h1>
        <p className="mt-3 max-w-xl text-[var(--muted)]">
          Google sign-in worked. This is your BudgetFreely home — a placeholder
          while we finish CSV import, analytics, and EMI tracking.
        </p>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-5">
          <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">
            Signed in as
          </dt>
          <dd className="mt-2 break-all text-[var(--ink)]">{user?.email}</dd>
        </div>
        <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-5">
          <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">
            Auth provider
          </dt>
          <dd className="mt-2 text-[var(--ink)]">Google via Supabase</dd>
        </div>
      </dl>

      <section aria-labelledby="next-steps-heading" className="space-y-4">
        <h2
          id="next-steps-heading"
          className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]"
        >
          Try next
        </h2>
        <ul className="space-y-3 text-sm">
          <li>
            <Link
              href="/accounts"
              className="font-medium text-[var(--accent)] hover:underline"
            >
              Add an account
            </Link>
            <span className="text-[var(--muted)]">
              {" "}
              — Chase, WF, or Apple Card
            </span>
          </li>
          <li>
            <Link
              href="/transactions"
              className="font-medium text-[var(--accent)] hover:underline"
            >
              Log a transaction
            </Link>
            <span className="text-[var(--muted)]">
              {" "}
              — EMI or subscription payment
            </span>
          </li>
          <li>
            <Link
              href="/dashboard"
              className="font-medium text-[var(--accent)] hover:underline"
            >
              Open dashboard
            </Link>
            <span className="text-[var(--muted)]">
              {" "}
              — quick counts and outflows
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}
