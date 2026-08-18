/**
 * Call inside a Server Action or Route Handler right before you need the
 * var — never at module top-level. Throwing at import time would break
 * the build for every page, including the fully-static marketing routes
 * that don't touch the database at all.
 */
export function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
}
