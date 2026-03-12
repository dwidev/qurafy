import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";
import * as schema from "./schema";
import { getDatabaseUrl } from "./get-database-url";

type Database = PostgresJsDatabase<typeof schema>;

type GlobalDatabase = typeof globalThis & {
  __qurafySqlClient?: Sql;
  __qurafyDb?: Database;
};

const globalForDatabase = globalThis as GlobalDatabase;

const client =
  globalForDatabase.__qurafySqlClient ??
  postgres(getDatabaseUrl(), {
    ssl: "require",
    prepare: false,
    // Keep the dev connection footprint small under Next.js HMR.
    max: process.env.NODE_ENV === "production" ? 10 : 1,
  });

export const db =
  globalForDatabase.__qurafyDb ??
  drizzle(client, { schema });

if (process.env.NODE_ENV !== "production") {
  globalForDatabase.__qurafySqlClient = client;
  globalForDatabase.__qurafyDb = db;
}
