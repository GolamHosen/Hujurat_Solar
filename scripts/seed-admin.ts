import "dotenv/config";
import { db, pool } from "@/db";
import { admins } from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

/**
 * Seed or update the admin user in the database.
 *
 * Usage:
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=YourSecurePass npx tsx --tsconfig tsconfig.json scripts/seed-admin.ts
 *
 * Both ADMIN_EMAIL and ADMIN_PASSWORD must be provided via environment
 * variables. This script NEVER stores credentials in source code.
 */
async function main() {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD?.trim();
  const name = process.env.ADMIN_NAME?.trim() || "Hujurat Admin";

  if (!email) {
    console.error("❌ ADMIN_EMAIL environment variable is required.");
    console.error("   Usage: ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=secret npx tsx --tsconfig tsconfig.json scripts/seed-admin.ts");
    process.exit(1);
  }

  if (!password) {
    console.error("❌ ADMIN_PASSWORD environment variable is required.");
    console.error("   Usage: ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=secret npx tsx --tsconfig tsconfig.json scripts/seed-admin.ts");
    process.exit(1);
  }

  console.log(`Hashing password for ${email}...`);
  const passwordHash = await bcrypt.hash(password, 12);

  // Check if admin already exists
  const existing = await db
    .select()
    .from(admins)
    .where(eq(admins.email, email))
    .limit(1);

  if (existing.length > 0) {
    // Update existing admin's password
    await db
      .update(admins)
      .set({ passwordHash, name })
      .where(eq(admins.email, email));
    console.log(`✅ Updated existing admin: ${email}`);
  } else {
    // Insert new admin
    await db.insert(admins).values({
      email,
      passwordHash,
      name,
    });
    console.log(`✅ Created new admin: ${email}`);
  }

  console.log("Admin seeded successfully. You can now log in at /dashboard/login");

  await pool.end();
}

main().catch((err) => {
  console.error("❌ Failed to seed admin:", err);
  process.exit(1);
});
