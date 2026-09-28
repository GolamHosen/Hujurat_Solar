import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const url = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!url) {
  throw new Error(
    "DATABASE_URL (or DIRECT_URL) is required for drizzle-kit. Set it in .env",
  );
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url,
    ssl: "prefer",
  },
});
