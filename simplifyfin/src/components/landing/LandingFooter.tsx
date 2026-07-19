export function LandingFooter() {
  return (
    <footer className="border-t border-[var(--line)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-8 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <p className="font-[family-name:var(--font-display)] text-[var(--ink)]">
          simplifyFIN
        </p>
        <p>Open source personal finance. USD default. Multi-currency ready.</p>
      </div>
    </footer>
  );
}
