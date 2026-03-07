const DEFAULT_DB_USER = "postgres";
const DEFAULT_DB_NAME = "postgres";
const DEFAULT_DB_PORT = "5432";

function getSupabaseProjectRef(supabaseUrl: string): string {
  try {
    const hostname = new URL(supabaseUrl).hostname;
    return hostname.split(".")[0] || "";
  } catch {
    return "";
  }
}

function buildDatabaseUrlFromSupabase(): string {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const dbPassword = process.env.SUPABASE_DB_PASSWORD;

  if (!supabaseUrl) {
    throw new Error(
      "Missing DATABASE_URL. Set DATABASE_URL directly, or provide NEXT_PUBLIC_SUPABASE_URL/SUPABASE_URL and SUPABASE_DB_PASSWORD.",
    );
  }

  if (!dbPassword) {
    throw new Error(
      "Missing SUPABASE_DB_PASSWORD. Supabase publishable keys are not valid for server database connections.",
    );
  }

  const projectRef = getSupabaseProjectRef(supabaseUrl);

  if (!projectRef) {
    throw new Error("Invalid NEXT_PUBLIC_SUPABASE_URL/SUPABASE_URL.");
  }

  const dbUser = process.env.SUPABASE_DB_USER || DEFAULT_DB_USER;
  const dbName = process.env.SUPABASE_DB_NAME || DEFAULT_DB_NAME;
  const dbHost = process.env.SUPABASE_DB_HOST || `db.${projectRef}.supabase.co`;
  const dbPort = process.env.SUPABASE_DB_PORT || DEFAULT_DB_PORT;

  return `postgresql://${encodeURIComponent(dbUser)}:${encodeURIComponent(dbPassword)}@${dbHost}:${dbPort}/${dbName}`;
}

export function getDatabaseUrl(): string {
  const directDatabaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL;

  if (directDatabaseUrl) {
    return directDatabaseUrl;
  }

  return buildDatabaseUrlFromSupabase();
}
