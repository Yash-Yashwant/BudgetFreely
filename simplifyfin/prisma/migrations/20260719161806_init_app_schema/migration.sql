-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "app";

-- CreateEnum
CREATE TYPE "app"."AccountType" AS ENUM ('checking', 'savings', 'credit', 'loan', 'investment', 'other');

-- CreateEnum
CREATE TYPE "app"."TransactionSource" AS ENUM ('simplefin', 'csv', 'manual');

-- CreateEnum
CREATE TYPE "app"."RecurringCadence" AS ENUM ('weekly', 'monthly', 'yearly', 'custom');

-- CreateEnum
CREATE TYPE "app"."RecurringKind" AS ENUM ('subscription', 'emi', 'other');

-- CreateEnum
CREATE TYPE "app"."RecurringStatus" AS ENUM ('detected', 'confirmed', 'ignored');

-- CreateEnum
CREATE TYPE "app"."ConnectionStatus" AS ENUM ('active', 'error', 'disconnected');

-- CreateTable
CREATE TABLE "app"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "defaultCurrency" TEXT NOT NULL DEFAULT 'USD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "app"."Connection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'simplefin',
    "encryptedAccessUrl" TEXT NOT NULL,
    "status" "app"."ConnectionStatus" NOT NULL DEFAULT 'active',
    "lastSyncAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."bank_accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mask" TEXT,
    "type" "app"."AccountType" NOT NULL DEFAULT 'other',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "balanceCents" BIGINT,
    "externalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bank_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."transactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "amountCents" BIGINT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "payee" TEXT NOT NULL,
    "memo" TEXT,
    "category" TEXT,
    "externalId" TEXT,
    "source" "app"."TransactionSource" NOT NULL DEFAULT 'manual',
    "fingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."recurring_series" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountId" TEXT,
    "merchantNormalized" TEXT NOT NULL,
    "typicalAmountCents" BIGINT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "cadence" "app"."RecurringCadence" NOT NULL DEFAULT 'monthly',
    "kind" "app"."RecurringKind" NOT NULL DEFAULT 'other',
    "status" "app"."RecurringStatus" NOT NULL DEFAULT 'detected',
    "nextExpectedDate" DATE,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recurring_series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."recurring_occurrences" (
    "id" TEXT NOT NULL,
    "seriesId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recurring_occurrences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "app"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "app"."Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "app"."Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "app"."VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "Connection_userId_idx" ON "app"."Connection"("userId");

-- CreateIndex
CREATE INDEX "bank_accounts_userId_idx" ON "app"."bank_accounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "bank_accounts_userId_externalId_key" ON "app"."bank_accounts"("userId", "externalId");

-- CreateIndex
CREATE INDEX "transactions_userId_date_idx" ON "app"."transactions"("userId", "date");

-- CreateIndex
CREATE INDEX "transactions_accountId_date_idx" ON "app"."transactions"("accountId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_accountId_fingerprint_key" ON "app"."transactions"("accountId", "fingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_accountId_externalId_key" ON "app"."transactions"("accountId", "externalId");

-- CreateIndex
CREATE INDEX "recurring_series_userId_status_idx" ON "app"."recurring_series"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "recurring_occurrences_transactionId_key" ON "app"."recurring_occurrences"("transactionId");

-- CreateIndex
CREATE INDEX "recurring_occurrences_seriesId_idx" ON "app"."recurring_occurrences"("seriesId");

-- AddForeignKey
ALTER TABLE "app"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."Connection" ADD CONSTRAINT "Connection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."bank_accounts" ADD CONSTRAINT "bank_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."transactions" ADD CONSTRAINT "transactions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "app"."bank_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."recurring_series" ADD CONSTRAINT "recurring_series_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."recurring_series" ADD CONSTRAINT "recurring_series_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "app"."bank_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."recurring_occurrences" ADD CONSTRAINT "recurring_occurrences_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "app"."recurring_series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."recurring_occurrences" ADD CONSTRAINT "recurring_occurrences_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "app"."transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
