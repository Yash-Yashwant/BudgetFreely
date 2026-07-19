export default function CheckEmailPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)]">
          simplifyFIN
        </p>
        <h1 className="mt-6 text-xl font-medium text-[var(--ink)]">
          Check your email
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          We sent a magic link. Open it on this device to finish signing in.
        </p>
        <a
          href="/login"
          className="mt-8 inline-block text-sm font-medium text-[var(--accent)] hover:underline"
        >
          Use a different email
        </a>
      </div>
    </main>
  );
}
