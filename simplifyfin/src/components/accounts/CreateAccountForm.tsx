"use client";

import { useActionState } from "react";
import {
  createAccountAction,
  type ActionResult,
} from "@/app/(app)/actions";
import { ACCOUNT_TYPE_OPTIONS } from "@/lib/account-types";

const initial: ActionResult | undefined = undefined;

export function CreateAccountForm() {
  const [state, formAction, pending] = useActionState(
    createAccountAction,
    initial,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Institution" name="institution" placeholder="Chase" required />
        <Field label="Account name" name="name" placeholder="Sapphire ****1234" required />
        <Field label="Last 4 (optional)" name="mask" placeholder="1234" maxLength={4} />
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-[var(--ink)]">
            Type
          </label>
          <select
            id="type"
            name="type"
            defaultValue="credit"
            className="mt-1 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm text-[var(--ink)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            {ACCOUNT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <Field label="Currency" name="currency" defaultValue="USD" required />
      </div>

      {state && !state.ok ? (
        <p className="text-sm text-red-700" role="alert">
          {state.error}
        </p>
      ) : null}
      {state?.ok ? (
        <p className="text-sm text-[var(--accent)]" role="status">
          Account added.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-60"
      >
        {pending ? "Saving…" : "Add account"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  ...props
}: {
  label: string;
  name: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-[var(--ink)]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        className="mt-1 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm text-[var(--ink)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
        {...props}
      />
    </div>
  );
}
