import type { AccountType } from "@/generated/prisma/client";

export const ACCOUNT_TYPE_OPTIONS: { value: AccountType; label: string }[] = [
  { value: "credit", label: "Credit card" },
  { value: "checking", label: "Checking" },
  { value: "savings", label: "Savings" },
  { value: "loan", label: "Loan / EMI" },
  { value: "investment", label: "Investment" },
  { value: "other", label: "Other" },
];
