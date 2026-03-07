import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { getDatabaseUrl } from "./get-database-url";

const client = postgres(getDatabaseUrl(), {
  ssl: "require",
  prepare: false,
});

export const db = drizzle(client, { schema });
