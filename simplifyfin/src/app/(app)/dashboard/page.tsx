import { listBankAccounts } from "@/lib/accounts";
import { formatMoney } from "@/lib/money";
import { getSessionUser } from "@/lib/session";
import { listTransactions } from "@/lib/transactions";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getSessionUser();
  const [accounts, transactions] = await Promise.all([
    listBankAccounts(),
    listTransactions(50),
  ]);

  const spendCents = transactions
    .filter((t) => BigInt(t.amountCents) < 0n)
    .reduce((sum, t) => sum + BigInt(t.amountCents), 0n);

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)]">
        Dashboard
      </h1>
      <p className="mt-2 text-[var(--muted)]">
        Signed in as {user?.email}.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Stat label="Accounts" value={String(accounts.length)} />
        <Stat label="Transactions" value={String(transactions.length)} />
        <Stat
          label="Recent outflows"
          value={
            spendCents === 0n
              ? "—"
              : formatMoney(spendCents, accounts[0]?.currency ?? "USD")
          }
        />
      </div>

      <div className="mt-10 flex flex-wrap gap-3 text-sm">
        <Link
          href="/accounts"
          className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-[var(--ink)] hover:border-[var(--ink)]/30"
        >
          Manage accounts
        </Link>
        <Link
          href="/transactions"
          className="rounded-md bg-[var(--accent)] px-4 py-2 font-medium text-white hover:bg-[var(--accent-hover)]"
        >
          Add transaction
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-5">
      <p className="text-xs uppercase tracking-wide text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-3 font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
        {value}
      </p>
    </div>
  );
}
