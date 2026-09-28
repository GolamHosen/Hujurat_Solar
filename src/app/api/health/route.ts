import { getPool, isDatabaseConfigured } from "@/db";

export const dynamic = "force-dynamic";

const NO_STORE = { "cache-control": "no-store" } as const;

/**
 * Liveness probe for uptime monitors.
 *
 * Deliberately opaque: it reports reachability only. Raw driver errors are
 * logged server-side because they can contain the database hostname, user name
 * or connection string fragments.
 */
export async function GET() {
  const startedAt = Date.now();

  if (!isDatabaseConfigured()) {
    return Response.json({ ok: false, databaseReachable: false, latencyMs: Date.now() - startedAt }, { status: 503, headers: NO_STORE });
  }

  try {
    await getPool().query("select 1");
    return Response.json({ ok: true, databaseReachable: true, latencyMs: Date.now() - startedAt }, { headers: NO_STORE });
  } catch (error) {
    console.error("Database health probe failed", error);
    return Response.json({ ok: false, databaseReachable: false, latencyMs: Date.now() - startedAt }, { status: 503, headers: NO_STORE });
  }
}

