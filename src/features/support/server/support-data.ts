import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import {
  donations,
  paymentTransactions,
  platformBankAccounts,
  supporterSubscriptions,
  user,
} from "@/db/schema";
import type {
  AdminSupportTransactionDetail,
  AdminSupportTransactionItem,
  AdminSupportTransactionTab,
  BillingCycle,
  CreateSadaqahDonationPayload,
  CreateSupporterSubscriptionPayload,
  PaymentTransactionStatus,
  PaymentTransactionSummary,
  SubmitTransactionProofPayload,
  SupportRequestKind,
  SupportTransferPageData,
  SupporterSubscriptionSummary,
} from "@/features/support/types";

const minimumSupporterAmount: Record<BillingCycle, number> = {
  monthly: 25_000,
  yearly: 200_000,
};

const pendingReviewStatuses: PaymentTransactionStatus[] = ["pending_payment", "pending_review"];
const transferExpiryHours = 48;
const adminTransactionStatusGroups: Record<AdminSupportTransactionTab, PaymentTransactionStatus[]> = {
  pending: ["pending_payment", "pending_review"],
  success: ["approved"],
  cancel: ["rejected", "expired"],
};

function normalizePositiveAmount(value: number) {
  if (!Number.isFinite(value)) {
    return NaN;
  }

  return Math.floor(value);
}

function addBillingCycle(date: Date, billingCycle: BillingCycle) {
  const next = new Date(date);

  if (billingCycle === "monthly") {
    next.setUTCMonth(next.getUTCMonth() + 1);
    return next;
  }

  next.setUTCFullYear(next.getUTCFullYear() + 1);
  return next;
}

function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

function generateReferenceCode(kind: SupportRequestKind) {
  const prefix = kind === "subscription" ? "SUP" : "SDQ";
  const stamp = Date.now().toString(36).toUpperCase();
  const nonce = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${stamp}-${nonce}`;
}

function toSubscriptionSummary(
  row: typeof supporterSubscriptions.$inferSelect,
): SupporterSubscriptionSummary {
  return {
    id: row.id,
    amount: row.amount,
    billingCycle: row.billingCycle,
    status: row.status,
    currentPeriodEnd: row.currentPeriodEnd.toISOString(),
    cancelAtPeriodEnd: row.cancelAtPeriodEnd,
  };
}

function toPaymentTransactionSummary(
  row: typeof paymentTransactions.$inferSelect,
): PaymentTransactionSummary {
  return {
    id: row.id,
    kind: row.kind,
    paymentMethod: row.paymentMethod,
    amount: row.amount,
    currency: row.currency,
    billingCycle: row.billingCycle,
    status: row.status,
    referenceCode: row.referenceCode,
    proofUrl: row.proofUrl,
    notes: row.notes,
    expiresAt: row.expiresAt ? row.expiresAt.toISOString() : null,
    submittedAt: row.submittedAt ? row.submittedAt.toISOString() : null,
  };
}

async function expirePendingSubscriptionRequests(tx: typeof db, userId: string, now: Date) {
  const pendingSubscriptions = await tx
    .select({
      id: supporterSubscriptions.id,
    })
    .from(supporterSubscriptions)
    .where(
      and(
        eq(supporterSubscriptions.userId, userId),
        eq(supporterSubscriptions.status, "pending"),
      ),
    );

  if (pendingSubscriptions.length > 0) {
    await tx
      .update(supporterSubscriptions)
      .set({
        status: "canceled",
        canceledAt: now,
        cancelAtPeriodEnd: false,
        updatedAt: now,
      })
      .where(
        and(
          eq(supporterSubscriptions.userId, userId),
          eq(supporterSubscriptions.status, "pending"),
        ),
      );

    await tx
      .update(paymentTransactions)
      .set({
        status: "expired",
        updatedAt: now,
      })
      .where(
        and(
          eq(paymentTransactions.userId, userId),
          eq(paymentTransactions.kind, "subscription"),
          inArray(paymentTransactions.status, pendingReviewStatuses),
        ),
      );
  }
}

export async function getCurrentSupporterSubscription(userId: string) {
  const [row] = await db
    .select()
    .from(supporterSubscriptions)
    .where(eq(supporterSubscriptions.userId, userId))
    .orderBy(desc(supporterSubscriptions.updatedAt))
    .limit(1);

  return row ? toSubscriptionSummary(row) : null;
}

export async function createSupporterSubscription(
  userId: string,
  payload: CreateSupporterSubscriptionPayload,
) {
  const amount = normalizePositiveAmount(payload.amount);
  const minimumAmount = minimumSupporterAmount[payload.billingCycle];

  if (!Number.isFinite(amount) || amount < minimumAmount) {
    throw new Error(`Supporter amount must be at least IDR ${minimumAmount.toLocaleString()}.`);
  }

  if (amount > 50_000_000) {
    throw new Error("Supporter amount exceeds the allowed limit.");
  }

  const now = new Date();
  const expiresAt = addHours(now, transferExpiryHours);

  const created = await db.transaction(async (tx) => {
    await expirePendingSubscriptionRequests(tx, userId, now);

    const [subscription] = await tx
      .insert(supporterSubscriptions)
      .values({
        userId,
        amount,
        billingCycle: payload.billingCycle,
        status: "pending",
        currentPeriodStart: now,
        currentPeriodEnd: now,
        cancelAtPeriodEnd: false,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    if (!subscription) {
      throw new Error("Unable to start supporter plan.");
    }

    const [charge] = await tx
      .insert(donations)
      .values({
        userId,
        supporterSubscriptionId: subscription.id,
        amount,
        type: "recurring",
        billingCycle: payload.billingCycle,
        status: "pending",
        createdAt: now,
      })
      .returning({
        id: donations.id,
      });

    if (!charge) {
      throw new Error("Unable to create supporter charge record.");
    }

    const [transaction] = await tx
      .insert(paymentTransactions)
      .values({
        userId,
        supporterSubscriptionId: subscription.id,
        donationId: charge.id,
        kind: "subscription",
        paymentMethod: "manual_bank_transfer",
        amount,
        currency: "IDR",
        billingCycle: payload.billingCycle,
        status: "pending_payment",
        referenceCode: generateReferenceCode("subscription"),
        expiresAt,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    if (!transaction) {
      throw new Error("Unable to create payment transaction.");
    }

    return {
      subscription,
      transaction,
    };
  });

  return {
    subscription: toSubscriptionSummary(created.subscription),
    transaction: toPaymentTransactionSummary(created.transaction),
  };
}

export async function createSadaqahDonation(
  userId: string,
  payload: CreateSadaqahDonationPayload,
) {
  const amount = normalizePositiveAmount(payload.amount);

  if (!Number.isFinite(amount) || amount < 10_000) {
    throw new Error("Sadaqah amount must be at least IDR 10,000.");
  }

  if (amount > 50_000_000) {
    throw new Error("Sadaqah amount exceeds the allowed limit.");
  }

  const now = new Date();
  const expiresAt = addHours(now, transferExpiryHours);

  const created = await db.transaction(async (tx) => {
    const [donation] = await tx
      .insert(donations)
      .values({
        userId,
        amount,
        supporterSubscriptionId: null,
        type: "one_time",
        billingCycle: null,
        status: "pending",
        createdAt: now,
      })
      .returning();

    if (!donation) {
      throw new Error("Unable to record sadaqah.");
    }

    const [transaction] = await tx
      .insert(paymentTransactions)
      .values({
        userId,
        supporterSubscriptionId: null,
        donationId: donation.id,
        kind: "donation",
        paymentMethod: "manual_bank_transfer",
        amount,
        currency: "IDR",
        billingCycle: null,
        status: "pending_payment",
        referenceCode: generateReferenceCode("donation"),
        expiresAt,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    if (!transaction) {
      throw new Error("Unable to create donation transaction.");
    }

    return {
      donation,
      transaction,
    };
  });

  return {
    donation: {
      id: created.donation.id,
      amount: created.donation.amount,
      createdAt: created.donation.createdAt.toISOString(),
    },
    transaction: toPaymentTransactionSummary(created.transaction),
  };
}

export async function submitTransactionProof(
  userId: string,
  payload: SubmitTransactionProofPayload,
) {
  const proofUrl = payload.proofUrl.trim();
  const notes = payload.notes.trim();

  if (!proofUrl && !notes) {
    throw new Error("Add a proof link or a note before submitting.");
  }

  const [transaction] = await db
    .select()
    .from(paymentTransactions)
    .where(
      and(
        eq(paymentTransactions.id, payload.transactionId),
        eq(paymentTransactions.userId, userId),
      ),
    )
    .limit(1);

  if (!transaction) {
    throw new Error("Payment transaction not found.");
  }

  if (["approved", "expired"].includes(transaction.status)) {
    throw new Error("This transaction can no longer be updated.");
  }

  const now = new Date();

  const [updatedTransaction] = await db
    .update(paymentTransactions)
    .set({
      proofUrl: proofUrl || null,
      notes: notes || null,
      status: "pending_review",
      submittedAt: now,
      updatedAt: now,
    })
    .where(eq(paymentTransactions.id, transaction.id))
    .returning();

  if (!updatedTransaction) {
    throw new Error("Unable to update payment proof.");
  }

  return toPaymentTransactionSummary(updatedTransaction);
}

export function isSupportAdmin(email: string) {
  const allowedEmails = (process.env.SUPPORT_ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return allowedEmails.includes(email.toLowerCase());
}

function getFallbackBankAccounts() {
  const bankName = process.env.PLATFORM_BANK_NAME ?? "Bank Transfer";
  const accountNumber = process.env.PLATFORM_BANK_ACCOUNT_NUMBER ?? "Set PLATFORM_BANK_ACCOUNT_NUMBER";
  const accountHolder = process.env.PLATFORM_BANK_ACCOUNT_HOLDER ?? "Qurafy";

  return [
    {
      id: "fallback-bank-account",
      bankName,
      accountNumber,
      accountHolder,
    },
  ];
}

async function getBankAccounts() {
  try {
    const bankAccounts = await db.select().from(platformBankAccounts);
    if (bankAccounts.length === 0) {
      return getFallbackBankAccounts();
    }

    return bankAccounts.map((account) => ({
      id: account.id,
      bankName: account.bankName,
      accountNumber: account.accountNumber,
      accountHolder: account.accountHolder,
    }));
  } catch {
    return getFallbackBankAccounts();
  }
}

function getSupportContact() {
  return {
    email: process.env.SUPPORT_CONTACT_EMAIL ?? "support@qurafy.local",
    phone: process.env.SUPPORT_CONTACT_PHONE ?? "+62 000 0000 0000",
  };
}

export async function getSupportTransferPageDataByTransaction(
  userId: string,
  transactionId: string,
): Promise<SupportTransferPageData> {
  const [bankAccounts, contact] = await Promise.all([
    getBankAccounts(),
    Promise.resolve(getSupportContact()),
  ]);

  const [transaction] = await db
    .select()
    .from(paymentTransactions)
    .where(
      and(
        eq(paymentTransactions.id, transactionId),
        eq(paymentTransactions.userId, userId),
      ),
    )
    .limit(1);

  if (!transaction) {
    throw new Error("Payment transaction not found.");
  }

  if (transaction.kind === "subscription") {
    const [subscription] = await db
      .select()
      .from(supporterSubscriptions)
      .where(eq(supporterSubscriptions.id, transaction.supporterSubscriptionId ?? ""))
      .limit(1);

    if (!subscription) {
      throw new Error("Supporter subscription request not found.");
    }

    return {
      kind: "subscription",
      requestId: subscription.id,
      amount: transaction.amount,
      billingCycle: transaction.billingCycle,
      status: subscription.status === "active" ? "active" : transaction.status,
      transaction: toPaymentTransactionSummary(transaction),
      bankAccounts,
      contact,
    };
  }

  const [donation] = await db
    .select()
    .from(donations)
    .where(eq(donations.id, transaction.donationId ?? ""))
    .limit(1);

  if (!donation) {
    throw new Error("Donation request not found.");
  }

  return {
    kind: "donation",
    requestId: donation.id,
    amount: transaction.amount,
    billingCycle: transaction.billingCycle,
    status: donation.status === "confirmed" ? "confirmed" : transaction.status,
    transaction: toPaymentTransactionSummary(transaction),
    bankAccounts,
    contact,
  };
}

export async function getPendingSupportTransactions(): Promise<AdminSupportTransactionItem[]> {
  return getAdminSupportTransactions("pending");
}

export async function getAdminSupportTransactions(
  tab: AdminSupportTransactionTab,
): Promise<AdminSupportTransactionItem[]> {
  const statuses = adminTransactionStatusGroups[tab];
  const rows = await db
    .select({
      transactionId: paymentTransactions.id,
      requestId: paymentTransactions.supporterSubscriptionId,
      donationId: paymentTransactions.donationId,
      kind: paymentTransactions.kind,
      userName: user.name,
      userEmail: user.email,
      amount: paymentTransactions.amount,
      currency: paymentTransactions.currency,
      billingCycle: paymentTransactions.billingCycle,
      status: paymentTransactions.status,
      referenceCode: paymentTransactions.referenceCode,
      proofUrl: paymentTransactions.proofUrl,
      notes: paymentTransactions.notes,
      createdAt: paymentTransactions.createdAt,
      submittedAt: paymentTransactions.submittedAt,
    })
    .from(paymentTransactions)
    .innerJoin(user, eq(paymentTransactions.userId, user.id))
    .where(inArray(paymentTransactions.status, statuses))
    .orderBy(desc(paymentTransactions.updatedAt));

  return rows.map((row) => ({
    transactionId: row.transactionId,
    requestId: row.kind === "subscription" ? row.requestId ?? "" : row.donationId ?? "",
    kind: row.kind,
    userName: row.userName,
    userEmail: row.userEmail,
    amount: row.amount,
    currency: row.currency,
    billingCycle: row.billingCycle,
    status: row.status,
    referenceCode: row.referenceCode,
    proofUrl: row.proofUrl,
    notes: row.notes,
    createdAt: row.createdAt.toISOString(),
    submittedAt: row.submittedAt ? row.submittedAt.toISOString() : null,
  }));
}

export async function getAdminSupportTransactionDetail(
  transactionId: string,
): Promise<AdminSupportTransactionDetail | null> {
  const [row] = await db
    .select({
      transactionId: paymentTransactions.id,
      requestId: paymentTransactions.supporterSubscriptionId,
      donationId: paymentTransactions.donationId,
      kind: paymentTransactions.kind,
      userName: user.name,
      userEmail: user.email,
      amount: paymentTransactions.amount,
      currency: paymentTransactions.currency,
      billingCycle: paymentTransactions.billingCycle,
      status: paymentTransactions.status,
      referenceCode: paymentTransactions.referenceCode,
      proofUrl: paymentTransactions.proofUrl,
      notes: paymentTransactions.notes,
      createdAt: paymentTransactions.createdAt,
      submittedAt: paymentTransactions.submittedAt,
      expiresAt: paymentTransactions.expiresAt,
      approvedAt: paymentTransactions.approvedAt,
      rejectedAt: paymentTransactions.rejectedAt,
      updatedAt: paymentTransactions.updatedAt,
    })
    .from(paymentTransactions)
    .innerJoin(user, eq(paymentTransactions.userId, user.id))
    .where(eq(paymentTransactions.id, transactionId))
    .limit(1);

  if (!row) {
    return null;
  }

  return {
    transactionId: row.transactionId,
    requestId: row.kind === "subscription" ? row.requestId ?? "" : row.donationId ?? "",
    kind: row.kind,
    userName: row.userName,
    userEmail: row.userEmail,
    amount: row.amount,
    currency: row.currency,
    billingCycle: row.billingCycle,
    status: row.status,
    referenceCode: row.referenceCode,
    proofUrl: row.proofUrl,
    notes: row.notes,
    createdAt: row.createdAt.toISOString(),
    submittedAt: row.submittedAt ? row.submittedAt.toISOString() : null,
    expiresAt: row.expiresAt ? row.expiresAt.toISOString() : null,
    approvedAt: row.approvedAt ? row.approvedAt.toISOString() : null,
    rejectedAt: row.rejectedAt ? row.rejectedAt.toISOString() : null,
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function approveSupportTransaction(transactionId: string, adminUserId: string) {
  const now = new Date();

  return db.transaction(async (tx) => {
    const [transaction] = await tx
      .select()
      .from(paymentTransactions)
      .where(eq(paymentTransactions.id, transactionId))
      .limit(1);

    if (!transaction) {
      throw new Error("Payment transaction not found.");
    }

    if (!pendingReviewStatuses.includes(transaction.status)) {
      throw new Error("This transaction is no longer pending review.");
    }

    if (transaction.kind === "subscription") {
      const [subscription] = await tx
        .select()
        .from(supporterSubscriptions)
        .where(eq(supporterSubscriptions.id, transaction.supporterSubscriptionId ?? ""))
        .limit(1);

      if (!subscription) {
        throw new Error("Supporter plan request not found.");
      }

      await tx
        .update(supporterSubscriptions)
        .set({
          status: "canceled",
          canceledAt: now,
          cancelAtPeriodEnd: false,
          updatedAt: now,
        })
        .where(
          and(
            eq(supporterSubscriptions.userId, subscription.userId),
            eq(supporterSubscriptions.status, "active"),
          ),
        );

      await tx
        .update(supporterSubscriptions)
        .set({
          status: "active",
          currentPeriodStart: now,
          currentPeriodEnd: addBillingCycle(now, subscription.billingCycle),
          canceledAt: null,
          updatedAt: now,
        })
        .where(eq(supporterSubscriptions.id, subscription.id));

      if (transaction.donationId) {
        await tx
          .update(donations)
          .set({
            status: "confirmed",
          })
          .where(eq(donations.id, transaction.donationId));
      }
    } else if (transaction.donationId) {
      await tx
        .update(donations)
        .set({
          status: "confirmed",
        })
        .where(eq(donations.id, transaction.donationId));
    }

    const [updatedTransaction] = await tx
      .update(paymentTransactions)
      .set({
        status: "approved",
        approvedAt: now,
        rejectedAt: null,
        reviewedByUserId: adminUserId,
        updatedAt: now,
      })
      .where(eq(paymentTransactions.id, transaction.id))
      .returning();

    if (!updatedTransaction) {
      throw new Error("Unable to approve transaction.");
    }

    return toPaymentTransactionSummary(updatedTransaction);
  });
}

export async function rejectSupportTransaction(
  transactionId: string,
  adminUserId: string,
  reason?: string,
) {
  const now = new Date();
  const normalizedReason = reason?.trim() ?? "";

  return db.transaction(async (tx) => {
    const [transaction] = await tx
      .select()
      .from(paymentTransactions)
      .where(eq(paymentTransactions.id, transactionId))
      .limit(1);

    if (!transaction) {
      throw new Error("Payment transaction not found.");
    }

    if (!pendingReviewStatuses.includes(transaction.status)) {
      throw new Error("This transaction is no longer pending review.");
    }

    if (transaction.kind === "subscription" && transaction.supporterSubscriptionId) {
      await tx
        .update(supporterSubscriptions)
        .set({
          status: "canceled",
          canceledAt: now,
          cancelAtPeriodEnd: false,
          updatedAt: now,
        })
        .where(eq(supporterSubscriptions.id, transaction.supporterSubscriptionId));
    }

    if (transaction.donationId) {
      await tx
        .update(donations)
        .set({
          status: "failed",
        })
        .where(eq(donations.id, transaction.donationId));
    }

    const [updatedTransaction] = await tx
      .update(paymentTransactions)
      .set({
        status: "rejected",
        rejectedAt: now,
        reviewedByUserId: adminUserId,
        notes: normalizedReason || transaction.notes,
        updatedAt: now,
      })
      .where(eq(paymentTransactions.id, transaction.id))
      .returning();

    if (!updatedTransaction) {
      throw new Error("Unable to reject transaction.");
    }

    return toPaymentTransactionSummary(updatedTransaction);
  });
}
