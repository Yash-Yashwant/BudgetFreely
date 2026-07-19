"use client";

import { useActionState } from "react";
import {
  createTransactionAction,
  type ActionResult,
} from "@/app/(app)/actions";
import type { BankAccountView } from "@/lib/accounts";

const initial: ActionResult | undefined = undefined;

export function CreateTransactionForm({
  accounts,
}: {
  accounts: BankAccountView[];
}) {
  const [state, formAction, pending] = useActionState(
    createTransactionAction,
    initial,
  );

  if (accounts.length === 0) {
    return (
      <p className="text-sm text-[var(--muted)]" role="status">
        Add an account first, then you can log transactions here.
      </p>
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="accountId" className="block text-sm font-medium text-[var(--ink)]">
            Account / card
          </label>
          <select
            id="accountId"
            name="accountId"
            required
            className="mt-1 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.institution} — {a.name}
                {a.mask ? ` ····${a.mask}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-[var(--ink)]">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={today}
            className="mt-1 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>

        <div>
          <label htmlFor="direction" className="block text-sm font-medium text-[var(--ink)]">
            Direction
          </label>
          <select
            id="direction"
            name="direction"
            defaultValue="expense"
            className="mt-1 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            <option value="expense">Expense / EMI payment</option>
            <option value="income">Income / refund</option>
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-[var(--ink)]">
            Amount
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0.01"
            required
            placeholder="0.00"
            className="mt-1 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>

        <div>
          <label htmlFor="payee" className="block text-sm font-medium text-[var(--ink)]">
            Payee / merchant
          </label>
          <input
            id="payee"
            name="payee"
            required
            placeholder="Netflix, Apple EMI, …"
            className="mt-1 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-[var(--ink)]">
            Category (optional)
          </label>
          <input
            id="category"
            name="category"
            placeholder="Subscriptions, EMI, Food…"
            className="mt-1 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>

        <div>
          <label htmlFor="memo" className="block text-sm font-medium text-[var(--ink)]">
            Memo (optional)
          </label>
          <input
            id="memo"
            name="memo"
            placeholder="0% APR, month 3 of 12"
            className="mt-1 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>
      </div>

      {state && !state.ok ? (
        <p className="text-sm text-red-700" role="alert">
          {state.error}
        </p>
      ) : null}
      {state?.ok ? (
        <p className="text-sm text-[var(--accent)]" role="status">
          Transaction saved.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-60"
      >
        {pending ? "Saving…" : "Add transaction"}
      </button>
    </form>
  );
}
