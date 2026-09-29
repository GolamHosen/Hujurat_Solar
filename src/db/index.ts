import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
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
 * - Sized for serverless: pool max defaults to 2 on Vercel / Lambda to prevent
 *   connection exhaustion, while defaulting to 10 in long-running Node environments.
 * - Built-in Supabase Root 2021 CA certificate ensures full TLS verification
 *   works seamlessly on Vercel where local `./certs` are not present in git.
 */

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const DEFAULT_POOL_MAX = isServerless ? 2 : 10;

class MissingDatabaseUrlError extends Error {
  constructor() {
    super(
      [
        "DATABASE_URL is not configured.",
        "",
        "Fix it in 3 steps:",
        "  1. Open the .env file in the project root (or set in Vercel Environment Variables).",
        "  2. Paste your Supabase connection string:",
        "     Supabase Dashboard -> Project Settings -> Database -> Connection string -> Pooler (port 6543)",
        '     DATABASE_URL="postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres"',
        "  3. Restart the dev server (npm run dev) or redeploy on Vercel.",
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
 * Official Supabase Root 2021 CA certificate (valid until 2031-04-26).
 * Embedded to ensure Vercel and serverless deployments have trusted, verified TLS
 * without requiring local certificate files that are excluded from git.
 */
const SUPABASE_ROOT_CA_2021 = `-----BEGIN CERTIFICATE-----
MIIDxDCCAqygAwIBAgIUbLxMod62P2ktCiAkxnKJwtE9VPYwDQYJKoZIhvcNAQEL
BQAwazELMAkGA1UEBhMCVVMxEDAOBgNVBAgMB0RlbHdhcmUxEzARBgNVBAcMCk5l
dyBDYXN0bGUxFTATBgNVBAoMDFN1cGFiYXNlIEluYzEeMBwGA1UEAwwVU3VwYWJh
c2UgUm9vdCAyMDIxIENBMB4XDTIxMDQyODEwNTY1M1oXDTMxMDQyNjEwNTY1M1ow
azELMAkGA1UEBhMCVVMxEDAOBgNVBAgMB0RlbHdhcmUxEzARBgNVBAcMCk5ldyBD
YXN0bGUxFTATBgNVBAoMDFN1cGFiYXNlIEluYzEeMBwGA1UEAwwVU3VwYWJhc2Ug
Um9vdCAyMDIxIENBMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqQXW
QyHOB+qR2GJobCq/CBmQ40G0oDmCC3mzVnn8sv4XNeWtE5XcEL0uVih7Jo4Dkx1Q
DmGHBH1zDfgs2qXiLb6xpw/CKQPypZW1JssOTMIfQppNQ87K75Ya0p25Y3ePS2t2
GtvHxNjUV6kjOZjEn2yWEcBdpOVCUYBVFBNMB4YBHkNRDa/+S4uywAoaTWnCJLUi
cvTlHmMw6xSQQn1UfRQHk50DMCEJ7Cy1RxrZJrkXXRP3LqQL2ijJ6F4yMfh+Gyb4
O4XajoVj/+R4GwywKYrrS8PrSNtwxr5StlQO8zIQUSMiq26wM8mgELFlS/32Uclt
NaQ1xBRizkzpZct9DwIDAQABo2AwXjALBgNVHQ8EBAMCAQYwHQYDVR0OBBYEFKjX
uXY32CztkhImng4yJNUtaUYsMB8GA1UdIwQYMBaAFKjXuXY32CztkhImng4yJNUt
aUYsMA8GA1UdEwEB/wQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEBAB8spzNn+4VU
tVxbdMaX+39Z50sc7uATmus16jmmHjhIHz+l/9GlJ5KqAMOx26mPZgfzG7oneL2b
VW+WgYUkTT3XEPFWnTp2RJwQao8/tYPXWEJDc0WVQHrpmnWOFKU/d3MqBgBm5y+6
jB81TU/RG2rVerPDWP+1MMcNNy0491CTL5XQZ7JfDJJ9CCmXSdtTl4uUQnSuv/Qx
Cea13BX2ZgJc7Au30vihLhub52De4P/4gonKsNHYdbWjg7OWKwNv/zitGDVDB9Y2
CMTyZKG3XEu5Ghl1LEnI3QmEKsqaCLv12BnVjbkSeZsMnevJPs1Ye6TjjJwdik5P
o/bKiIz+Fq8=
-----END CERTIFICATE-----`;

/**
 * TLS settings for managed providers.
 *
 * Certificate verification is ON by default.
 * Priority:
 * 1. DATABASE_SSL_CA environment variable (PEM string).
 * 2. DATABASE_SSL_CA_FILE file path (if present on disk).
 * 3. Built-in Supabase Root 2021 CA certificate for *.supabase.co / *.supabase.com.
 * 4. Standard verified TLS (for providers using public trusted CAs like Neon or RDS).
 */
function buildSslConfig(connectionString: string): PoolConfig["ssl"] {
  const ca = process.env.DATABASE_SSL_CA?.replace(/\\n/g, "\n").trim();
  if (ca) {
    return { ca, rejectUnauthorized: true };
  }

  const caFilePath = process.env.DATABASE_SSL_CA_FILE?.trim();
  if (caFilePath) {
    const resolvedPath = path.isAbsolute(caFilePath) ? caFilePath : path.resolve(process.cwd(), caFilePath);
    if (existsSync(resolvedPath)) {
      try {
        return { ca: readFileSync(resolvedPath, "utf8"), rejectUnauthorized: true };
      } catch (error) {
        console.warn(`[db] Failed to read certificate at "${resolvedPath}":`, error);
      }
    } else {
      console.warn(
        `[db] DATABASE_SSL_CA_FILE was specified ("${caFilePath}"), but the file was not found on disk. Falling back to built-in provider certificate.`,
      );
    }
  }

  // Auto-verify Supabase connections using the official Root CA
  if (/supabase\.(co|com)|pooler\.supabase\.com/i.test(connectionString)) {
    return { ca: SUPABASE_ROOT_CA_2021, rejectUnauthorized: true };
  }

  if (/^(1|true|yes)$/i.test(process.env.DATABASE_SSL_NO_VERIFY ?? "")) {
    console.warn(
      "[db] DATABASE_SSL_NO_VERIFY is enabled: database TLS certificates are NOT verified, so the connection is open to man-in-the-middle attacks. Download your provider's root certificate and set DATABASE_SSL_CA instead.",
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
    connectionTimeoutMillis: 5_000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10_000,
  };

  const sslDisabled = /sslmode=disable/i.test(connectionString);
  if (!sslDisabled && isManagedProvider(connectionString) && !connectionStringHandlesSsl(connectionString)) {
    config.ssl = buildSslConfig(connectionString);
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

