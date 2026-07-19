import { CreateTransactionForm } from "@/components/transactions/CreateTransactionForm";
import { TransactionList } from "@/components/transactions/TransactionList";
import { listBankAccounts } from "@/lib/accounts";
import { listTransactions } from "@/lib/transactions";

export default async function TransactionsPage() {
  const [accounts, transactions] = await Promise.all([
    listBankAccounts(),
    listTransactions(),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ink)]">
          Transactions
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          Manual entry for EMIs and subscriptions until bank sync is live.
        </p>
      </div>

      <section aria-labelledby="add-txn-heading" className="space-y-4">
        <h2
          id="add-txn-heading"
          className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]"
        >
          Add transaction
        </h2>
        <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
          <CreateTransactionForm accounts={accounts} />
        </div>
      </section>

      <section aria-labelledby="txn-list-heading" className="space-y-4">
        <h2
          id="txn-list-heading"
          className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]"
        >
          Recent ({transactions.length})
        </h2>
        <TransactionList transactions={transactions} />
      </section>
    </div>
  );
}
