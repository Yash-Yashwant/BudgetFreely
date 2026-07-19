import type { AccountType } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";

export type CreateBankAccountInput = {
  institution: string;
  name: string;
  mask?: string;
  type: AccountType;
  currency?: string;
};

export type BankAccountView = {
  id: string;
  institution: string;
  name: string;
  mask: string | null;
  type: AccountType;
  currency: string;
  balanceCents: string | null;
};

export async function listBankAccounts(): Promise<BankAccountView[]> {
  const userId = await requireUserId();
  const rows = await prisma.bankAccount.findMany({
    where: { userId },
    orderBy: [{ institution: "asc" }, { name: "asc" }],
  });

  return rows.map((row) => ({
    id: row.id,
    institution: row.institution,
    name: row.name,
    mask: row.mask,
    type: row.type,
    currency: row.currency,
    balanceCents: row.balanceCents?.toString() ?? null,
  }));
}

export async function createBankAccount(
  input: CreateBankAccountInput,
): Promise<BankAccountView> {
  const userId = await requireUserId();
  const institution = input.institution.trim();
  const name = input.name.trim();
  const mask = input.mask?.trim() || null;

  if (!institution || !name) {
    throw new Error("Institution and name are required");
  }

  const row = await prisma.bankAccount.create({
    data: {
      userId,
      institution,
      name,
      mask,
      type: input.type,
      currency: (input.currency ?? "USD").toUpperCase(),
    },
  });

  return {
    id: row.id,
    institution: row.institution,
    name: row.name,
    mask: row.mask,
    type: row.type,
    currency: row.currency,
    balanceCents: row.balanceCents?.toString() ?? null,
  };
}

export async function deleteBankAccount(accountId: string): Promise<void> {
  const userId = await requireUserId();
  const existing = await prisma.bankAccount.findFirst({
    where: { id: accountId, userId },
  });
  if (!existing) {
    throw new Error("Account not found");
  }
  await prisma.bankAccount.delete({ where: { id: accountId } });
}
