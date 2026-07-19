"use client";

import { useActionState } from "react";
import {
  connectSimpleFinAction,
  disconnectSimpleFinAction,
  syncSimpleFinAction,
  type ActionResult,
} from "@/app/(app)/actions";
import type { ConnectionView } from "@/lib/simplefin/sync";

const initial: ActionResult | undefined = undefined;

export function SimpleFinPanel({
  connections,
}: {
  connections: ConnectionView[];
}) {
  const [connectState, connectAction, connectPending] = useActionState(
    connectSimpleFinAction,
    initial,
  );
  const [syncState, syncAction, syncPending] = useActionState(
    syncSimpleFinAction,
    initial,
  );

  const active = connections[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          SimpleFIN
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Bring your own setup token from{" "}
          <a
            href="https://bridge.simplefin.org/simplefin/create"
            target="_blank"
            rel="noreferrer"
            className="text-[var(--accent)] underline-offset-2 hover:underline"
          >
            bridge.simplefin.org
          </a>
          . We exchange it once for an access URL and sync Chase / WF (and other
          linked banks). Limit: about one full sync per day.
        </p>
      </div>

      {active ? (
        <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 space-y-4">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[var(--muted)]">Status</dt>
              <dd className="mt-1 capitalize text-[var(--ink)]">{active.status}</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Last sync</dt>
              <dd className="mt-1 text-[var(--ink)]">
                {active.lastSyncAt
                  ? new Date(active.lastSyncAt).toLocaleString()
                  : "Never"}
              </dd>
            </div>
          </dl>
          {active.lastError ? (
            <p className="text-sm text-amber-800" role="status">
              {active.lastError}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <form action={syncAction}>
              <input type="hidden" name="connectionId" value={active.id} />
              <button
                type="submit"
                disabled={syncPending}
                className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-60"
              >
                {syncPending ? "Syncing…" : "Sync now"}
              </button>
            </form>
            <form action={disconnectSimpleFinAction}>
              <input type="hidden" name="connectionId" value={active.id} />
              <button
                type="submit"
                className="rounded-md border border-[var(--line)] px-4 py-2 text-sm text-[var(--muted)] hover:text-red-700"
              >
                Disconnect
              </button>
            </form>
          </div>

          {syncState && !syncState.ok ? (
            <p className="text-sm text-red-700" role="alert">
              {syncState.error}
            </p>
          ) : null}
          {syncState?.ok && "message" in syncState ? (
            <p className="text-sm text-[var(--accent)]" role="status">
              {syncState.message}
            </p>
          ) : null}
        </div>
      ) : (
        <form
          action={connectAction}
          className="space-y-4 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5"
        >
          <div>
            <label
              htmlFor="setupToken"
              className="block text-sm font-medium text-[var(--ink)]"
            >
              Setup token
            </label>
            <textarea
              id="setupToken"
              name="setupToken"
              required
              rows={3}
              placeholder="Paste base64 setup token"
              className="mt-1 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 font-mono text-xs text-[var(--ink)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>
          {connectState && !connectState.ok ? (
            <p className="text-sm text-red-700" role="alert">
              {connectState.error}
            </p>
          ) : null}
          {connectState?.ok ? (
            <p className="text-sm text-[var(--accent)]" role="status">
              Connected. Run Sync now to pull accounts.
            </p>
          ) : null}
          <button
            type="submit"
            disabled={connectPending}
            className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-60"
          >
            {connectPending ? "Connecting…" : "Connect SimpleFIN"}
          </button>
        </form>
      )}
    </div>
  );
}
