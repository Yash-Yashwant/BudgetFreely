const points = [
  {
    title: "EMIs & subscriptions first",
    body: "0% APR installments and monthly subs live in one place — so small recurring charges stop slipping through.",
  },
  {
    title: "Card-aware by design",
    body: "Every transaction knows which account paid. Chase, Wells Fargo, Apple Card — tagged, not mixed.",
  },
  {
    title: "Numbers you can trust",
    body: "Balances, spend, and cashflow before any AI prose. Insights come later, grounded in your data.",
  },
];

export function LandingWhy() {
  return (
    <section id="why" className="scroll-mt-8 border-t border-[var(--line)] bg-[var(--surface)]">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)] sm:text-4xl">
          Built for the money that repeats
        </h2>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          BudgetFreely started with EMI tracking. Everything else — bank sync,
          CSV import, analytics — serves that clarity.
        </p>

        <ol className="mt-14 space-y-12">
          {points.map((point, index) => (
            <li key={point.title} className="grid gap-3 sm:grid-cols-[4rem_1fr] sm:gap-8">
              <span className="font-[family-name:var(--font-display)] text-3xl text-[var(--accent)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-lg font-medium text-[var(--ink)]">
                  {point.title}
                </h3>
                <p className="mt-2 max-w-xl text-[var(--muted)]">{point.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
