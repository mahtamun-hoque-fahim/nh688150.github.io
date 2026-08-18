import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Lazy getter — evaluating this at module load time (before env vars
 * exist) breaks the build. Always call getDb() inside a request/action,
 * never at the top level of a module.
 */
export function getDb() {
  if (!process.env.DATABASE_URL) {
    return null as unknown as ReturnType<typeof drizzle<typeof schema>>;
  }
  return drizzle(neon(process.env.DATABASE_URL), { schema });
}
