import { deleteTransactionAction } from "@/app/(app)/actions";
import type { TransactionView } from "@/lib/transactions";

export function TransactionList({
  transactions,
}: {
  transactions: TransactionView[];
}) {
  if (transactions.length === 0) {
    return (
      <div
        role="status"
        className="rounded-lg border border-dashed border-[var(--line)] px-6 py-12 text-center"
      >
        <h2 className="text-sm font-medium text-[var(--ink)]">
          No transactions yet
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Log an EMI or subscription payment manually — CSV and SimpleFIN come
          next.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--surface)]">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-[var(--line)] text-[var(--muted)]">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              Date
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Payee
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Card
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Category
            </th>
            <th scope="col" className="px-4 py-3 font-medium text-right">
              Amount
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--line)]">
          {transactions.map((txn) => {
            const outflow = BigInt(txn.amountCents) < 0n;
            return (
              <tr key={txn.id}>
                <td className="whitespace-nowrap px-4 py-3 text-[var(--muted)]">
                  {txn.date}
                </td>
                <td className="px-4 py-3 text-[var(--ink)]">
                  <div>{txn.payee}</div>
                  {txn.memo ? (
                    <div className="text-xs text-[var(--muted)]">{txn.memo}</div>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-[var(--muted)]">
                  {txn.institution}
                  <span className="text-[var(--ink)]"> · {txn.accountName}</span>
                </td>
                <td className="px-4 py-3 text-[var(--muted)]">
                  {txn.category ?? "—"}
                </td>
                <td
                  className={`whitespace-nowrap px-4 py-3 text-right font-medium ${
                    outflow ? "text-[var(--ink)]" : "text-[var(--accent)]"
                  }`}
                >
                  {txn.formattedAmount}
                </td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteTransactionAction}>
                    <input
                      type="hidden"
                      name="transactionId"
                      value={txn.id}
                    />
                    <button
                      type="submit"
                      className="text-[var(--muted)] underline-offset-2 hover:text-red-700 hover:underline"
                      aria-label={`Delete transaction ${txn.payee}`}
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
