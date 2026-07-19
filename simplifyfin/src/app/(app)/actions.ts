"use server";

import { revalidatePath } from "next/cache";
import type { AccountType } from "@/generated/prisma/client";
import { createBankAccount, deleteBankAccount } from "@/lib/accounts";
import {
  createManualTransaction,
  deleteTransaction,
} from "@/lib/transactions";

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

function formString(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function createAccountAction(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await createBankAccount({
      institution: formString(formData, "institution"),
      name: formString(formData, "name"),
      mask: formString(formData, "mask") || undefined,
      type: formString(formData, "type") as AccountType,
      currency: formString(formData, "currency") || "USD",
    });
    revalidatePath("/accounts");
    revalidatePath("/transactions");
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not create account",
    };
  }
}

export async function deleteAccountAction(formData: FormData): Promise<void> {
  try {
    await deleteBankAccount(formString(formData, "accountId"));
    revalidatePath("/accounts");
    revalidatePath("/transactions");
    revalidatePath("/dashboard");
  } catch {
    // Form posts don't surface ActionResult; list revalidates on success only.
  }
}

export async function createTransactionAction(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const amount = Number(formString(formData, "amount"));
    const direction = formString(formData, "direction");
    await createManualTransaction({
      accountId: formString(formData, "accountId"),
      date: formString(formData, "date"),
      amount,
      isExpense: direction !== "income",
      payee: formString(formData, "payee"),
      memo: formString(formData, "memo") || undefined,
      category: formString(formData, "category") || undefined,
    });
    revalidatePath("/transactions");
    revalidatePath("/dashboard");
    revalidatePath("/recurring");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error ? err.message : "Could not create transaction",
    };
  }
}

export async function deleteTransactionAction(
  formData: FormData,
): Promise<void> {
  try {
    await deleteTransaction(formString(formData, "transactionId"));
    revalidatePath("/transactions");
    revalidatePath("/dashboard");
  } catch {
    // ignore — page refresh will show current state
  }
}
