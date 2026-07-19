import { CreateAccountForm } from "@/components/accounts/CreateAccountForm";
import { AccountList } from "@/components/accounts/AccountList";
import { listBankAccounts } from "@/lib/accounts";

export default async function AccountsPage() {
  const accounts = await listBankAccounts();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)]">
          Accounts
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          Cards and banks you spend from. Tag every transaction to an account —
          SimpleFIN and CSV will fill these later.
        </p>
      </div>

      <section aria-labelledby="add-account-heading" className="space-y-4">
        <h2
          id="add-account-heading"
          className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]"
        >
          Add account
        </h2>
        <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
          <CreateAccountForm />
        </div>
      </section>

      <section aria-labelledby="your-accounts-heading" className="space-y-4">
        <h2
          id="your-accounts-heading"
          className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]"
        >
          Your accounts ({accounts.length})
        </h2>
        <AccountList accounts={accounts} />
      </section>
    </div>
  );
}
