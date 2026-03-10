import {
  bigint,
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
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

export const userProfile = pgTable("user_profile", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  username: text("username").notNull().unique(),
  location: text("location").notNull(),
  bio: text("bio").notNull(),
  dailyGoal: text("daily_goal").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userLoginDays = pgTable(
  "user_login_days",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    date: timestamp("date").notNull(),
  },
  (table) => [
    index("user_login_days_user_id_idx").on(table.userId),
    uniqueIndex("user_login_days_user_date_unique_idx").on(table.userId, table.date),
  ],
);

export const khatamPlans = pgTable(
  "khatam_plans",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    name: text("name").notNull(),
    startJuz: integer("start_juz").notNull().default(1),
    startDate: timestamp("start_date").notNull(),
    targetDate: timestamp("target_date").notNull(),
    isCompleted: boolean("is_completed").default(false).notNull(),
  },
  (table) => [
    index("khatam_plans_user_id_idx").on(table.userId),
    index("khatam_plans_user_completed_idx").on(table.userId, table.isCompleted),
  ],
);

export const khatamProgress = pgTable(
  "khatam_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    planId: uuid("plan_id")
      .references(() => khatamPlans.id, { onDelete: "cascade" })
      .notNull(),
    date: timestamp("date").notNull(),
    isDone: boolean("is_done").default(false).notNull(),
    completedVerses: integer("completed_verses").default(0).notNull(),
  },
  (table) => [
    index("khatam_progress_plan_id_idx").on(table.planId),
    uniqueIndex("khatam_progress_plan_date_unique_idx").on(table.planId, table.date),
  ],
);

export const khatamPlanProgress = pgTable(
  "khatam_plan_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    planId: uuid("plan_id")
      .references(() => khatamPlans.id, { onDelete: "cascade" })
      .notNull(),
    completedDays: integer("completed_days").default(0).notNull(),
    completedJuz: integer("completed_juz").default(0).notNull(),
    currentStreak: integer("current_streak").default(0).notNull(),
    bestStreak: integer("best_streak").default(0).notNull(),
    lastCompletedAt: timestamp("last_completed_at"),
  },
  (table) => [
    uniqueIndex("khatam_plan_progress_plan_unique_idx").on(table.planId),
  ],
);

export const memorizationGoals = pgTable(
  "memorization_goals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    title: text("title").notNull(),
    surahNumber: integer("surah_number").notNull(),
    totalVerses: integer("total_verses").notNull(),
    targetDays: integer("target_days").notNull(),
    repsPerVerse: integer("reps_per_verse").default(3).notNull(),
    status: goalStatusEnum("status").default("active").notNull(),
  },
  (table) => [
    index("memorization_goals_user_id_idx").on(table.userId),
    index("memorization_goals_user_status_idx").on(table.userId, table.status),
  ],
);

export const memorizationProgress = pgTable(
  "memorization_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    goalId: uuid("goal_id")
      .references(() => memorizationGoals.id, { onDelete: "cascade" })
      .notNull(),
    completedDays: integer("completed_days").default(0).notNull(),
    completedVerses: integer("completed_verses").default(0).notNull(),
    currentStreak: integer("current_streak").default(0).notNull(),
    bestStreak: integer("best_streak").default(0).notNull(),
    lastCompletedAt: timestamp("last_completed_at"),
  },
  (table) => [
    uniqueIndex("memorization_progress_goal_unique_idx").on(table.goalId),
  ],
);

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
