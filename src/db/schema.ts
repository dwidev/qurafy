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
export const supporterSubscriptionStatusEnum = pgEnum("supporter_subscription_status", ["pending", "active", "canceled"]);
export const paymentTransactionKindEnum = pgEnum("payment_transaction_kind", ["subscription", "donation"]);
export const paymentMethodEnum = pgEnum("payment_method", ["manual_bank_transfer"]);
export const paymentTransactionStatusEnum = pgEnum("payment_transaction_status", [
  "pending_payment",
  "pending_review",
  "approved",
  "rejected",
  "expired",
]);
export const goalStatusEnum = pgEnum("goal_status", ["active", "completed"]);
export const themePreferenceEnum = pgEnum("theme_preference", ["light", "dark", "system"]);
export const readerModeEnum = pgEnum("reader_mode", ["verse", "mushaf"]);
export const habitTypeEnum = pgEnum("habit_type", ["boolean", "quantitative"]);
export const habitRoutineEnum = pgEnum("habit_routine", ["morning", "afternoon", "evening", "anytime"]);

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

export const userSettings = pgTable("user_settings", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  theme: themePreferenceEnum("theme").default("system").notNull(),
  readerMode: readerModeEnum("reader_mode").default("verse").notNull(),
  arabicFontSize: integer("arabic_font_size").default(4).notNull(),
  showTranslation: boolean("show_translation").default(true).notNull(),
  showTransliteration: boolean("show_transliteration").default(true).notNull(),
  readingReminders: boolean("reading_reminders").default(true).notNull(),
  hifzRepetitions: boolean("hifz_repetitions").default(true).notNull(),
  khatamDaily: boolean("khatam_daily").default(true).notNull(),
  marketing: boolean("marketing").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userActivity = pgTable(
  "user_activity",
  {
    userId: text("user_id")
      .primaryKey()
      .references(() => user.id, { onDelete: "cascade" }),
    lastActivityDate: timestamp("last_activity_date"),
    lastLoginTime: timestamp("last_login_time"),
    lastLogoutTime: timestamp("last_logout_time"),
    currentStreak: integer("current_streak").default(0).notNull(),
    bestStreak: integer("best_streak").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("user_activity_last_activity_date_idx").on(table.lastActivityDate),
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
    deletedAt: timestamp("deleted_at"),
    expiresAt: timestamp("expires_at"),
  },
  (table) => [
    index("khatam_plans_user_id_idx").on(table.userId),
    index("khatam_plans_user_completed_idx").on(table.userId, table.isCompleted),
    index("khatam_plans_user_expires_idx").on(table.userId, table.expiresAt),
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
    deletedAt: timestamp("deleted_at"),
    expiresAt: timestamp("expires_at"),
  },
  (table) => [
    index("memorization_goals_user_id_idx").on(table.userId),
    index("memorization_goals_user_status_idx").on(table.userId, table.status),
    index("memorization_goals_user_expires_idx").on(table.userId, table.expiresAt),
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

export const habits = pgTable(
  "habits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    title: text("title").notNull(),
    category: text("category").notNull(),
    color: text("color").default("emerald").notNull(),
    iconName: text("icon_name"),
    type: habitTypeEnum("type").default("boolean").notNull(),
    routine: habitRoutineEnum("routine").default("anytime").notNull(),
    target: integer("target").default(1).notNull(),
    unit: text("unit"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    archivedAt: timestamp("archived_at"),
  },
  (table) => [
    index("habits_user_id_idx").on(table.userId),
    index("habits_user_archived_idx").on(table.userId, table.archivedAt),
    index("habits_user_routine_idx").on(table.userId, table.routine),
  ],
);

export const habitEntries = pgTable(
  "habit_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    habitId: uuid("habit_id")
      .references(() => habits.id, { onDelete: "cascade" })
      .notNull(),
    date: timestamp("date").notNull(),
    value: integer("value").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("habit_entries_habit_id_idx").on(table.habitId),
    index("habit_entries_date_idx").on(table.date),
    uniqueIndex("habit_entries_habit_date_unique_idx").on(table.habitId, table.date),
  ],
);

export const donations = pgTable("donations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  supporterSubscriptionId: uuid("supporter_subscription_id").references(() => supporterSubscriptions.id, {
    onDelete: "set null",
  }),
  amount: bigint("amount", { mode: "number" }).notNull(),
  type: donationTypeEnum("type").notNull(),
  billingCycle: billingCycleEnum("billing_cycle"),
  status: paymentStatusEnum("status").default("pending").notNull(),
  paymentProofUrl: text("payment_proof_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const supporterSubscriptions = pgTable(
  "supporter_subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    amount: bigint("amount", { mode: "number" }).notNull(),
    billingCycle: billingCycleEnum("billing_cycle").notNull(),
    status: supporterSubscriptionStatusEnum("status").default("pending").notNull(),
    currentPeriodStart: timestamp("current_period_start").notNull(),
    currentPeriodEnd: timestamp("current_period_end").notNull(),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
    canceledAt: timestamp("canceled_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("supporter_subscriptions_user_id_idx").on(table.userId),
    index("supporter_subscriptions_user_status_idx").on(table.userId, table.status),
  ],
);

export const paymentTransactions = pgTable(
  "payment_transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    supporterSubscriptionId: uuid("supporter_subscription_id").references(() => supporterSubscriptions.id, {
      onDelete: "cascade",
    }),
    donationId: uuid("donation_id").references(() => donations.id, {
      onDelete: "cascade",
    }),
    kind: paymentTransactionKindEnum("kind").notNull(),
    paymentMethod: paymentMethodEnum("payment_method").default("manual_bank_transfer").notNull(),
    amount: bigint("amount", { mode: "number" }).notNull(),
    currency: text("currency").default("IDR").notNull(),
    billingCycle: billingCycleEnum("billing_cycle"),
    status: paymentTransactionStatusEnum("status").default("pending_payment").notNull(),
    referenceCode: text("reference_code").notNull().unique(),
    proofUrl: text("proof_url"),
    notes: text("notes"),
    expiresAt: timestamp("expires_at"),
    submittedAt: timestamp("submitted_at"),
    approvedAt: timestamp("approved_at"),
    rejectedAt: timestamp("rejected_at"),
    reviewedByUserId: text("reviewed_by_user_id").references(() => user.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("payment_transactions_user_id_idx").on(table.userId),
    index("payment_transactions_status_idx").on(table.status),
    index("payment_transactions_subscription_id_idx").on(table.supporterSubscriptionId),
    index("payment_transactions_donation_id_idx").on(table.donationId),
  ],
);

export const platformBankAccounts = pgTable("platform_bank_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  bankName: text("bank_name").notNull(),
  accountNumber: text("account_number").notNull(),
  accountHolder: text("account_holder").notNull(),
});
