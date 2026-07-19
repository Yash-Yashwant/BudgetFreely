import type { TransactionSource } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { formatMoney, toCents, transactionFingerprint } from "@/lib/money";
import { requireUserId } from "@/lib/session";

export type CreateTransactionInput = {
  accountId: string;
  date: string; // YYYY-MM-DD
  /** Absolute dollars; direction via `isExpense` */
  amount: number;
  isExpense: boolean;
  payee: string;
  memo?: string;
  category?: string;
  currency?: string;
};

export type TransactionView = {
  id: string;
  accountId: string;
  accountName: string;
  institution: string;
  date: string;
  amountCents: string;
  currency: string;
  payee: string;
  memo: string | null;
  category: string | null;
  source: TransactionSource;
  formattedAmount: string;
};

function parseDateOnly(date: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Date must be YYYY-MM-DD");
  }
  return new Date(`${date}T00:00:00.000Z`);
}

export async function listTransactions(limit = 100): Promise<TransactionView[]> {
  const userId = await requireUserId();
  const rows = await prisma.transaction.findMany({
    where: { userId },
    include: { account: true },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    take: limit,
  });

  return rows.map((row) => ({
    id: row.id,
    accountId: row.accountId,
    accountName: row.account.name,
    institution: row.account.institution,
    date: row.date.toISOString().slice(0, 10),
    amountCents: row.amountCents.toString(),
    currency: row.currency,
    payee: row.payee,
    memo: row.memo,
    category: row.category,
    source: row.source,
    formattedAmount: formatMoney(row.amountCents, row.currency),
  }));
}

export async function createManualTransaction(
  input: CreateTransactionInput,
): Promise<TransactionView> {
  const userId = await requireUserId();
  const payee = input.payee.trim();
  if (!payee) {
    throw new Error("Payee is required");
  }
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error("Amount must be a positive number");
  }

  const account = await prisma.bankAccount.findFirst({
    where: { id: input.accountId, userId },
  });
  if (!account) {
    throw new Error("Account not found");
  }

  const currency = (input.currency ?? account.currency).toUpperCase();
  const signed = input.isExpense ? -input.amount : input.amount;
  const amountCents = toCents(signed, currency);
  const date = parseDateOnly(input.date);
  const dateKey = input.date;
  const fingerprint = transactionFingerprint({
    date: dateKey,
    amountCents,
    payee,
  });

  const row = await prisma.transaction.create({
    data: {
      userId,
      accountId: account.id,
      date,
      amountCents,
      currency,
      payee,
      memo: input.memo?.trim() || null,
      category: input.category?.trim() || null,
      source: "manual",
      fingerprint,
    },
    include: { account: true },
  });

  return {
    id: row.id,
    accountId: row.accountId,
    accountName: row.account.name,
    institution: row.account.institution,
    date: dateKey,
    amountCents: row.amountCents.toString(),
    currency: row.currency,
    payee: row.payee,
    memo: row.memo,
    category: row.category,
    source: row.source,
    formattedAmount: formatMoney(row.amountCents, row.currency),
  };
}

export async function deleteTransaction(transactionId: string): Promise<void> {
  const userId = await requireUserId();
  const existing = await prisma.transaction.findFirst({
    where: { id: transactionId, userId },
  });
  if (!existing) {
    throw new Error("Transaction not found");
  }
  await prisma.transaction.delete({ where: { id: transactionId } });
}
