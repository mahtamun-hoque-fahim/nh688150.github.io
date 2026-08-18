/**
 * Creates the very first admin account — run once, locally, after
 * DATABASE_URL and BETTER_AUTH_SECRET exist. Every subsequent admin is
 * created through the invite-link flow in the dashboard, not this script.
 *
 * Usage: npm run create-admin -- you@example.com "your name" "a-strong-password"
 */
import { auth } from "../src/lib/auth";
import { getDb } from "../src/lib/db";

async function main() {
  if (!getDb()) {
    console.error("DATABASE_URL is not set. Add it to .env.local and try again.");
    process.exit(1);
  }

  const [email, name, password] = process.argv.slice(2);

  if (!email || !name || !password) {
    console.error('Usage: npm run create-admin -- you@example.com "Your Name" "password"');
    process.exit(1);
  }
  if (password.length < 10) {
    console.error("Password must be at least 10 characters.");
    process.exit(1);
  }

  await auth.api.createUser({
    body: { email, name, password, role: "admin" },
  });

  console.log(`Admin account created for ${email}. You can now sign in at /studio/login.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
