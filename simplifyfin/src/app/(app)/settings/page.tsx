import { getSessionUser } from "@/lib/session";

export default async function SettingsPage() {
  const user = await getSessionUser();

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)]">
        Settings
      </h1>
      <dl className="mt-8 space-y-4 text-sm">
        <div>
          <dt className="text-[var(--muted)]">Email</dt>
          <dd className="mt-1 text-[var(--ink)]">{user?.email}</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">Auth</dt>
          <dd className="mt-1 text-[var(--ink)]">Google via Supabase</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">Default currency</dt>
          <dd className="mt-1 text-[var(--ink)]">USD</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">SimpleFIN</dt>
          <dd className="mt-1 text-[var(--muted)]">
            Connect token (BYOK) — not wired yet
          </dd>
        </div>
      </dl>
    </div>
  );
}
