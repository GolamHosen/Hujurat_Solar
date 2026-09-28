import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { readFileSync } from "node:fs";
import { Pool, type PoolConfig } from "pg";
import * as schema from "./schema";

/**
 * Database module — Drizzle ORM + node-postgres (PostgreSQL / Supabase).
 *
 * Design notes:
 * - Lazy initialization: importing this module never connects or throws.
 *   The pool is created on first actual query, so builds and static
 *   generation never crash because of a missing/invalid DATABASE_URL.
 * - Singleton across HMR / serverless invocations via globalThis cache.
 * - Auto-SSL for managed Postgres providers (Supabase, Neon, RDS, ...).
 * - Clear, actionable error when DATABASE_URL is not configured.
 */

const DEFAULT_POOL_MAX = 10;

class MissingDatabaseUrlError extends Error {
  constructor() {
    super(
      [
        "DATABASE_URL is not configured.",
        "",
        "Fix it in 3 steps:",
        "  1. Open the .env file in the project root.",
        "  2. Paste your Supabase connection string:",
        "     Supabase Dashboard -> Project Settings -> Database -> Connection string -> Pooler (port 6543)",
        '     DATABASE_URL="postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres"',
        "  3. Restart the dev server (npm run dev).",
        "",
        "Note: Turso (libsql://) URLs are not supported by this PostgreSQL schema.",
      ].join("\n"),
    );
    this.name = "MissingDatabaseUrlError";
  }
}

function getDatabaseUrl(): string | undefined {
  const url = process.env.DATABASE_URL?.trim();
  return url ? url : undefined;
}

/** True when DATABASE_URL points at a managed Postgres provider requiring TLS. */
function isManagedProvider(url: string): boolean {
  return (
    /supabase\.(co|com)|neon\.tech|render\.com|amazonaws\.com|azure\.com|timescale\.(com|cloud)/i.test(
      url,
    ) || /sslmode=(require|verify-ca|verify-full)/i.test(url)
  );
}

/**
 * TLS settings for managed providers.
 *
 * Certificate verification is ON by default. The previous behaviour
 * (`rejectUnauthorized: false`) is equivalent to `sslmode=require`: it encrypts
 * the connection but accepts ANY certificate, so a network attacker able to
 * intercept it could read and modify every query — the pooler carries the admin
 * password hash and all customer lead data.
 *
 * Managed providers publish their server root certificate:
 *   Supabase Dashboard -> Project Settings -> Database -> SSL configuration
 * Point DATABASE_SSL_CA_FILE at the downloaded file (or paste the PEM into
 * DATABASE_SSL_CA) and the connection is both encrypted and verified.
 *
 * Only fall back to DATABASE_SSL_NO_VERIFY=true as a deliberate, temporary
 * trade-off — it logs a warning on every cold start.
 */
function buildSslConfig(): PoolConfig["ssl"] {
  const caFilePath = process.env.DATABASE_SSL_CA_FILE?.trim();
  if (caFilePath) {
    try {
      return { ca: readFileSync(caFilePath, "utf8"), rejectUnauthorized: true };
    } catch (error) {
      throw new Error(
        `DATABASE_SSL_CA_FILE points at "${caFilePath}" but the certificate could not be read: ${
          error instanceof Error ? error.message : "unknown error"
        }`,
      );
    }
  }

  const ca = process.env.DATABASE_SSL_CA?.replace(/\\n/g, "\n").trim();
  if (ca) {
    return { ca, rejectUnauthorized: true };
  }

  if (/^(1|true|yes)$/i.test(process.env.DATABASE_SSL_NO_VERIFY ?? "")) {
    console.warn(
      "[db] DATABASE_SSL_NO_VERIFY is enabled: database TLS certificates are NOT verified, so the connection is open to man-in-the-middle attacks. Download your provider's root certificate and set DATABASE_SSL_CA_FILE instead.",
    );
    return { rejectUnauthorized: false };
  }

  return { rejectUnauthorized: true };
}

/** True when the connection string already carries explicit SSL instructions. */
function connectionStringHandlesSsl(connectionString: string): boolean {
  return /sslmode=(verify-ca|verify-full)/i.test(connectionString) || /sslrootcert=/i.test(connectionString);
}

function createPool(connectionString: string): Pool {
  const config: PoolConfig = {
    connectionString,
    max: Number(process.env.DATABASE_POOL_MAX) || DEFAULT_POOL_MAX,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 15_000,
  };

  const sslDisabled = /sslmode=disable/i.test(connectionString);
  if (!sslDisabled && isManagedProvider(connectionString) && !connectionStringHandlesSsl(connectionString)) {
    config.ssl = buildSslConfig();
  }

  return new Pool(config);
}

const globalForDb = globalThis as typeof globalThis & {
  __hujuratPgPool?: Pool;
  __hujuratDb?: NodePgDatabase<typeof schema>;
};

/** Get (or lazily create) the shared pg connection pool. */
export function getPool(): Pool {
  if (!globalForDb.__hujuratPgPool) {
    const url = getDatabaseUrl();
    if (!url) throw new MissingDatabaseUrlError();
    globalForDb.__hujuratPgPool = createPool(url);
  }
  return globalForDb.__hujuratPgPool;
}

/** Get (or lazily create) the shared Drizzle instance. */
export function getDb(): NodePgDatabase<typeof schema> {
  if (!globalForDb.__hujuratDb) {
    globalForDb.__hujuratDb = drizzle(getPool(), { schema });
  }
  return globalForDb.__hujuratDb;
}

/** Whether DATABASE_URL is configured (does not connect). */
export const isDatabaseConfigured = (): boolean => Boolean(getDatabaseUrl());

/**
 * Lazy proxy — keeps `import { db } from "@/db"` free of side effects.
 * The pool is only created when a query is actually executed.
 */
function lazy<T extends object>(factory: () => T): T {
  return new Proxy({} as T, {
    get(_target, prop) {
      const instance = factory();
      const value = Reflect.get(instance, prop);
      return typeof value === "function" ? value.bind(instance) : value;
    },
  });
}

/** Drizzle database instance (lazy — safe to import at module scope). */
export const db = lazy(getDb);

/** Shared pg pool (lazy — safe to import at module scope, e.g. scripts). */
export const pool = lazy(getPool);

export { schema };
export type Database = NodePgDatabase<typeof schema>;

