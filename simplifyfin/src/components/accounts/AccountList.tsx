import { deleteAccountAction } from "@/app/(app)/actions";
import type { BankAccountView } from "@/lib/accounts";
import { formatMoney } from "@/lib/money";

export function AccountList({ accounts }: { accounts: BankAccountView[] }) {
  if (accounts.length === 0) {
    return (
      <div
        role="status"
        className="rounded-lg border border-dashed border-[var(--line)] px-6 py-12 text-center"
      >
        <h2 className="text-sm font-medium text-[var(--ink)]">No accounts yet</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Add Chase, Wells Fargo, or Apple Card so transactions can be tagged to a
          card.
        </p>
      </div>
    );
  }

  return (
    <ul role="list" className="divide-y divide-[var(--line)] rounded-lg border border-[var(--line)] bg-[var(--surface)]">
      {accounts.map((account) => (
        <li
          key={account.id}
          className="flex flex-wrap items-center justify-between gap-3 px-4 py-4"
        >
          <div>
            <p className="font-medium text-[var(--ink)]">
              {account.name}
              {account.mask ? (
                <span className="text-[var(--muted)]"> ····{account.mask}</span>
              ) : null}
            </p>
            <p className="mt-0.5 text-sm text-[var(--muted)]">
              {account.institution} · {account.type} · {account.currency}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <p className="font-[family-name:var(--font-display)] text-lg text-[var(--ink)]">
              {account.balanceCents != null
                ? formatMoney(BigInt(account.balanceCents), account.currency)
                : "—"}
            </p>
            <form action={deleteAccountAction}>
              <input type="hidden" name="accountId" value={account.id} />
              <button
                type="submit"
                className="text-sm text-[var(--muted)] underline-offset-2 hover:text-red-700 hover:underline"
                aria-label={`Delete ${account.name}`}
              >
                Delete
              </button>
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}
