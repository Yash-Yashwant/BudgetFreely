export type SimpleFinOrg = {
  domain?: string;
  name?: string;
  "sfin-url"?: string;
};

export type SimpleFinTransaction = {
  id: string;
  posted: number;
  amount: string;
  description: string;
  pending?: boolean;
  transacted_at?: number;
};

export type SimpleFinAccount = {
  id: string;
  name: string;
  currency?: string;
  balance?: string;
  "available-balance"?: string;
  "balance-date"?: number;
  org?: SimpleFinOrg;
  conn_id?: string;
  transactions?: SimpleFinTransaction[];
};

export type SimpleFinConnection = {
  conn_id?: string;
  name?: string;
  org_id?: string;
  org_url?: string;
};

export type SimpleFinAccountsResponse = {
  errors?: string[];
  errlist?: Array<{ code?: string; message?: string } | string>;
  accounts?: SimpleFinAccount[];
  connections?: SimpleFinConnection[];
};

export function decodeSetupToken(setupToken: string): string {
  const trimmed = setupToken.trim();
  const claimUrl = Buffer.from(trimmed, "base64").toString("utf8").trim();
  if (!claimUrl.startsWith("http")) {
    throw new Error("Invalid SimpleFIN setup token");
  }
  return claimUrl;
}

/** One-time claim: setup token → access URL (contains basic-auth credentials). */
export async function claimAccessUrl(setupToken: string): Promise<string> {
  const claimUrl = decodeSetupToken(setupToken);
  const response = await fetch(claimUrl, {
    method: "POST",
    body: "",
  });
  if (!response.ok) {
    throw new Error(
      `SimpleFIN claim failed (${response.status}). Token may already be used.`,
    );
  }
  const accessUrl = (await response.text()).trim();
  if (!accessUrl.startsWith("http")) {
    throw new Error("SimpleFIN returned an invalid access URL");
  }
  return accessUrl;
}

function parseAccessUrl(accessUrl: string): {
  accountsUrl: string;
  username: string;
  password: string;
} {
  const url = new URL(accessUrl);
  const username = decodeURIComponent(url.username);
  const password = decodeURIComponent(url.password);
  if (!username || !password) {
    throw new Error("SimpleFIN access URL is missing credentials");
  }
  url.username = "";
  url.password = "";
  const base = url.toString().replace(/\/$/, "");
  return {
    accountsUrl: `${base}/accounts`,
    username,
    password,
  };
}

export async function fetchAccounts(
  accessUrl: string,
  options?: { startDate?: Date; endDate?: Date },
): Promise<SimpleFinAccountsResponse> {
  const { accountsUrl, username, password } = parseAccessUrl(accessUrl);
  const params = new URLSearchParams({ version: "2" });

  if (options?.startDate) {
    params.set(
      "start-date",
      String(Math.floor(options.startDate.getTime() / 1000)),
    );
  }
  if (options?.endDate) {
    params.set(
      "end-date",
      String(Math.floor(options.endDate.getTime() / 1000)),
    );
  }

  const auth = Buffer.from(`${username}:${password}`).toString("base64");
  const response = await fetch(`${accountsUrl}?${params.toString()}`, {
    headers: { Authorization: `Basic ${auth}` },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`SimpleFIN /accounts failed (${response.status})`);
  }

  return (await response.json()) as SimpleFinAccountsResponse;
}

export function formatSimpleFinErrors(data: SimpleFinAccountsResponse): string[] {
  const out: string[] = [];
  if (Array.isArray(data.errors)) {
    out.push(...data.errors.map(String));
  }
  if (Array.isArray(data.errlist)) {
    for (const item of data.errlist) {
      if (typeof item === "string") out.push(item);
      else if (item?.message) out.push(item.message);
    }
  }
  return out;
}
