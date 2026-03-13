export type BillingCycle = "monthly" | "yearly";
export type SupportRequestKind = "subscription" | "donation";
export type PaymentTransactionStatus =
  | "pending_payment"
  | "pending_review"
  | "approved"
  | "rejected"
  | "expired";

export type AdminSupportTransactionTab = "pending" | "success" | "cancel";

export type CreateSupporterSubscriptionPayload = {
  amount: number;
  billingCycle: BillingCycle;
};

export type CreateSadaqahDonationPayload = {
  amount: number;
};

export type SupporterSubscriptionSummary = {
  id: string;
  amount: number;
  billingCycle: BillingCycle;
  status: "pending" | "active" | "canceled";
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
};

export type PaymentTransactionSummary = {
  id: string;
  kind: SupportRequestKind;
  paymentMethod: "manual_bank_transfer";
  amount: number;
  currency: string;
  billingCycle: BillingCycle | null;
  status: PaymentTransactionStatus;
  referenceCode: string;
  proofUrl: string | null;
  notes: string | null;
  expiresAt: string | null;
  submittedAt: string | null;
};

export type SupportBankAccount = {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
};

export type ManualTransferContact = {
  email: string;
  phone: string;
};

export type SupportTransferPageData = {
  kind: SupportRequestKind;
  requestId: string;
  amount: number;
  billingCycle: BillingCycle | null;
  status: PaymentTransactionStatus | "pending" | "confirmed" | "active" | "canceled" | "failed";
  transaction: PaymentTransactionSummary;
  bankAccounts: SupportBankAccount[];
  contact: ManualTransferContact;
};

export type SubmitTransactionProofPayload = {
  transactionId: string;
  proofUrl: string;
  notes: string;
};

export type AdminSupportTransactionItem = {
  transactionId: string;
  requestId: string;
  kind: SupportRequestKind;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  billingCycle: BillingCycle | null;
  status: PaymentTransactionStatus;
  referenceCode: string;
  proofUrl: string | null;
  notes: string | null;
  createdAt: string;
  submittedAt: string | null;
};

export type AdminSupportTransactionDetail = AdminSupportTransactionItem & {
  expiresAt: string | null;
  approvedAt: string | null;
  rejectedAt: string | null;
  updatedAt: string;
};
