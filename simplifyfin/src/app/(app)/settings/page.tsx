import { getSessionUser } from "@/lib/session";
import { listSimpleFinConnections } from "@/lib/simplefin/sync";
import { SimpleFinPanel } from "@/components/simplefin/SimpleFinPanel";

export default async function SettingsPage() {
  const user = await getSessionUser();
  const connections = await listSimpleFinConnections();

  return (
    <div className="space-y-12">
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
        </dl>
      </div>

      <SimpleFinPanel connections={connections} />
    </div>
  );
}
