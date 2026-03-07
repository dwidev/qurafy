import {
  bigint,
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const paymentStatusEnum = pgEnum("payment_status", ["pending", "confirmed", "failed"]);
export const donationTypeEnum = pgEnum("donation_type", ["recurring", "one_time"]);
export const billingCycleEnum = pgEnum("billing_cycle", ["monthly", "yearly"]);
export const goalStatusEnum = pgEnum("goal_status", ["active", "completed"]);

// Better-Auth core tables (Drizzle adapter expects these model names).
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_user_id_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("account_user_id_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

// Alias retained for existing domain references.
export const users = user;

export const khatamPlans = pgTable("khatam_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  startJuz: integer("start_juz").notNull().default(1),
  startDate: timestamp("start_date").notNull(),
  targetDate: timestamp("target_date").notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
});

export const khatamProgress = pgTable("khatam_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  planId: uuid("plan_id")
    .references(() => khatamPlans.id, { onDelete: "cascade" })
    .notNull(),
  date: timestamp("date").notNull(),
  isDone: boolean("is_done").default(false).notNull(),
});

export const memorizationGoals = pgTable("memorization_goals", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  surahNumber: integer("surah_number").notNull(),
  targetDays: integer("target_days").notNull(),
  repsPerVerse: integer("reps_per_verse").default(3).notNull(),
  status: goalStatusEnum("status").default("active").notNull(),
});

export const memorizationProgress = pgTable("memorization_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  goalId: uuid("goal_id")
    .references(() => memorizationGoals.id, { onDelete: "cascade" })
    .notNull(),
  verseNumber: integer("verse_number").notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
});

export const donations = pgTable("donations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  amount: bigint("amount", { mode: "number" }).notNull(),
  type: donationTypeEnum("type").notNull(),
  billingCycle: billingCycleEnum("billing_cycle"),
  status: paymentStatusEnum("status").default("pending").notNull(),
  paymentProofUrl: text("payment_proof_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const platformBankAccounts = pgTable("platform_bank_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  bankName: text("bank_name").notNull(),
  accountNumber: text("account_number").notNull(),
  accountHolder: text("account_holder").notNull(),
});
