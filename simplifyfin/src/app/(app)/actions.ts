"use server";

import { revalidatePath } from "next/cache";
import type { AccountType } from "@/generated/prisma/client";
import { createBankAccount, deleteBankAccount } from "@/lib/accounts";
import {
  connectSimpleFin,
  disconnectSimpleFin,
  syncSimpleFin,
} from "@/lib/simplefin/sync";
import {
  createManualTransaction,
  deleteTransaction,
} from "@/lib/transactions";

export type ActionResult =
  | { ok: true; message?: string }
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
    revalidatePath("/settings");
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
    // ignore
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
    // ignore
  }
}

export async function connectSimpleFinAction(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await connectSimpleFin(formString(formData, "setupToken"));
    revalidatePath("/settings");
    revalidatePath("/accounts");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error ? err.message : "Could not connect SimpleFIN",
    };
  }
}

export async function syncSimpleFinAction(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const connectionId = formString(formData, "connectionId") || undefined;
    const result = await syncSimpleFin(connectionId);
    revalidatePath("/settings");
    revalidatePath("/accounts");
    revalidatePath("/transactions");
    revalidatePath("/dashboard");
    revalidatePath("/home");
    const warn =
      result.warnings.length > 0
        ? ` Warnings: ${result.warnings.join("; ")}`
        : "";
    return {
      ok: true,
      message: `Synced ${result.accountsUpserted} accounts, ${result.transactionsUpserted} transactions.${warn}`,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "SimpleFIN sync failed",
    };
  }
}

export async function disconnectSimpleFinAction(
  formData: FormData,
): Promise<void> {
  try {
    await disconnectSimpleFin(formString(formData, "connectionId"));
    revalidatePath("/settings");
    revalidatePath("/accounts");
  } catch {
    // ignore
  }
}
