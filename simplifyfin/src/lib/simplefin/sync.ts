import type { AccountType } from "@/generated/prisma/client";
import { encryptSecret, decryptSecret } from "@/lib/crypto";
import { toCents, transactionFingerprint } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import {
  claimAccessUrl,
  fetchAccounts,
  formatSimpleFinErrors,
  type SimpleFinAccount,
} from "@/lib/simplefin/client";

export type ConnectionView = {
  id: string;
  status: string;
  lastSyncAt: string | null;
  lastError: string | null;
  createdAt: string;
};

export type SyncResult = {
  accountsUpserted: number;
  transactionsUpserted: number;
  warnings: string[];
};

function inferAccountType(name: string): AccountType {
  const n = name.toLowerCase();
  if (n.includes("credit") || n.includes("card") || n.includes("visa") || n.includes("mastercard")) {
    return "credit";
  }
  if (n.includes("saving")) return "savings";
  if (n.includes("check") || n.includes("checking") || n.includes("spend")) {
    return "checking";
  }
  if (n.includes("loan") || n.includes("mortgage")) return "loan";
  if (n.includes("invest") || n.includes("broker")) return "investment";
  return "other";
}

function institutionFor(account: SimpleFinAccount, connName?: string): string {
  return (
    account.org?.name ||
    account.org?.domain ||
    connName ||
    "SimpleFIN"
  );
}

function postedDate(posted: number): { date: Date; dateKey: string } {
  const ms = posted > 0 ? posted * 1000 : Date.now();
  const date = new Date(ms);
  const dateKey = date.toISOString().slice(0, 10);
  return { date: new Date(`${dateKey}T00:00:00.000Z`), dateKey };
}

export async function listSimpleFinConnections(): Promise<ConnectionView[]> {
  const userId = await requireUserId();
  const rows = await prisma.connection.findMany({
    where: { userId, provider: "simplefin" },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((row) => ({
    id: row.id,
    status: row.status,
    lastSyncAt: row.lastSyncAt?.toISOString() ?? null,
    lastError: row.lastError,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function connectSimpleFin(setupToken: string): Promise<ConnectionView> {
  const userId = await requireUserId();
  const token = setupToken.trim();
  if (!token) {
    throw new Error("Paste your SimpleFIN setup token");
  }

  const accessUrl = await claimAccessUrl(token);
  const encryptedAccessUrl = encryptSecret(accessUrl);

  // Replace prior SimpleFIN connection for this user (one bridge link for now)
  await prisma.connection.deleteMany({
    where: { userId, provider: "simplefin" },
  });

  const row = await prisma.connection.create({
    data: {
      userId,
      provider: "simplefin",
      encryptedAccessUrl,
      status: "active",
    },
  });

  return {
    id: row.id,
    status: row.status,
    lastSyncAt: null,
    lastError: null,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function disconnectSimpleFin(connectionId: string): Promise<void> {
  const userId = await requireUserId();
  await prisma.connection.deleteMany({
    where: { id: connectionId, userId, provider: "simplefin" },
  });
}

export async function syncSimpleFin(connectionId?: string): Promise<SyncResult> {
  const userId = await requireUserId();
  const connection = await prisma.connection.findFirst({
    where: {
      userId,
      provider: "simplefin",
      ...(connectionId ? { id: connectionId } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  if (!connection) {
    throw new Error("No SimpleFIN connection. Paste a setup token first.");
  }

  const accessUrl = decryptSecret(connection.encryptedAccessUrl);
  const end = new Date();
  const start = new Date(end.getTime() - 90 * 24 * 60 * 60 * 1000);

  let data;
  try {
    data = await fetchAccounts(accessUrl, { startDate: start, endDate: end });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync failed";
    await prisma.connection.update({
      where: { id: connection.id },
      data: { status: "error", lastError: message },
    });
    throw err;
  }

  const warnings = formatSimpleFinErrors(data);
  const connectionsById = new Map(
    (data.connections ?? [])
      .filter((c) => c.conn_id)
      .map((c) => [c.conn_id!, c.name ?? ""]),
  );

  let accountsUpserted = 0;
  let transactionsUpserted = 0;

  for (const sfAccount of data.accounts ?? []) {
    const currency = (sfAccount.currency ?? "USD").toUpperCase();
    const institution = institutionFor(
      sfAccount,
      sfAccount.conn_id ? connectionsById.get(sfAccount.conn_id) : undefined,
    );
    const balanceCents =
      sfAccount.balance != null && sfAccount.balance !== ""
        ? toCents(Number(sfAccount.balance), currency)
        : null;

    const bankAccount = await prisma.bankAccount.upsert({
      where: {
        userId_externalId: {
          userId,
          externalId: sfAccount.id,
        },
      },
      create: {
        userId,
        institution,
        name: sfAccount.name,
        type: inferAccountType(sfAccount.name),
        currency,
        balanceCents,
        externalId: sfAccount.id,
      },
      update: {
        institution,
        name: sfAccount.name,
        currency,
        balanceCents,
      },
    });
    accountsUpserted += 1;

    for (const txn of sfAccount.transactions ?? []) {
      if (txn.pending) continue;
      if (!txn.id || txn.posted <= 0) continue;

      const amount = Number(txn.amount);
      if (!Number.isFinite(amount)) continue;

      const amountCents = toCents(amount, currency);
      const { date, dateKey } = postedDate(txn.posted);
      const payee = txn.description?.trim() || "Unknown";
      const fingerprint = transactionFingerprint({
        date: dateKey,
        amountCents,
        payee,
      });

      await prisma.transaction.upsert({
        where: {
          accountId_externalId: {
            accountId: bankAccount.id,
            externalId: txn.id,
          },
        },
        create: {
          userId,
          accountId: bankAccount.id,
          date,
          amountCents,
          currency,
          payee,
          externalId: txn.id,
          source: "simplefin",
          fingerprint,
        },
        update: {
          date,
          amountCents,
          currency,
          payee,
          fingerprint,
        },
      });
      transactionsUpserted += 1;
    }
  }

  await prisma.connection.update({
    where: { id: connection.id },
    data: {
      status: "active",
      lastSyncAt: new Date(),
      lastError: warnings.length ? warnings.join("; ") : null,
    },
  });

  return { accountsUpserted, transactionsUpserted, warnings };
}
