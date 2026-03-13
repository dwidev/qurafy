# Payment Architecture: Manual Now, Gateway-Ready Later

**Project:** Qurafy  
**Status:** Proposed Architecture  
**Last Updated:** March 13, 2026

---

## 1. Goal
Design a payment architecture that works in two stages:

* `Stage 1`: manual bank transfer with admin approval
* `Stage 2`: automated payment gateway with instant activation

The key requirement is:
* Stage 1 should not force a full rewrite when Stage 2 is introduced.

This means the system must be designed around:
* a stable payment domain model,
* explicit payment states,
* explicit subscription states,
* a provider abstraction where `manual_bank_transfer` is just one payment method.

## 2. Core Product Decision
For Qurafy, the correct long-term model is:

* `Free`
* `Pro Monthly`
* `Pro Yearly`
* `Pure Sadaqah`

And the correct payment architecture is:

* `Subscription` is the entitlement model
* `Payment` is how money is collected
* `Donation` is a separate support record for one-time giving

Do not treat these as the same object.

## 3. Recommended Domain Model
### A. Plan
Represents what the user is buying.

Suggested plans:
* `free`
* `pro_monthly`
* `pro_yearly`

Suggested fields:
* `id`
* `code`
* `name`
* `billing_cycle`
* `amount`
* `currency`
* `is_active`

### B. Subscription
Represents a user's ongoing Pro access.

Suggested fields:
* `id`
* `user_id`
* `plan_code`
* `status`
* `current_period_start`
* `current_period_end`
* `cancel_at_period_end`
* `payment_method_type`
* `activated_at`
* `canceled_at`
* `created_at`
* `updated_at`

Suggested statuses:
* `pending`
* `active`
* `past_due`
* `canceled`
* `expired`

### C. Payment Transaction
Represents one payment attempt or one transfer instruction.

This is the most important piece for migration safety.

Suggested fields:
* `id`
* `user_id`
* `subscription_id` nullable
* `kind` with values like `subscription` or `donation`
* `payment_method` with values like `manual_bank_transfer`, `gateway_card`, `gateway_va`, `gateway_ewallet`
* `amount`
* `currency`
* `status`
* `reference_code`
* `provider_name` nullable
* `provider_transaction_id` nullable
* `proof_url` nullable
* `notes` nullable
* `expires_at` nullable
* `submitted_at` nullable
* `approved_at` nullable
* `rejected_at` nullable
* `created_at`
* `updated_at`

Suggested statuses:
* `draft`
* `pending_payment`
* `pending_review`
* `approved`
* `rejected`
* `expired`
* `failed`

### D. Donation
Represents one-time sadaqah intent and history.

Suggested fields:
* `id`
* `user_id`
* `transaction_id`
* `amount`
* `status`
* `created_at`

Donation status should follow transaction approval, but remain a separate domain object from subscription.

### E. Entitlement
Represents what the user can actually use in the app.

Suggested fields:
* `user_id`
* `plan_type`
* `billing_cycle`
* `memorize_active_limit`
* `khatam_active_limit`
* `has_advanced_analytics`
* `has_premium_reminders`
* `has_supporter_badge`
* `effective_from`
* `effective_until`

This keeps billing logic separate from feature checks.

## 4. Recommended State Model
### Manual Subscription Flow
1. User chooses `Pro Monthly` or `Pro Yearly`
2. System creates:
   * `subscription` with status `pending`
   * `payment_transaction` with status `pending_payment`
3. User is sent to transfer instructions page
4. User sends transfer and optionally uploads proof
5. Transaction becomes `pending_review`
6. Admin approves
7. Transaction becomes `approved`
8. Subscription becomes `active`
9. Entitlements become `pro`

### Manual Donation Flow
1. User chooses `Pure Sadaqah`
2. System creates:
   * `donation`
   * `payment_transaction` with status `pending_payment`
3. User sees transfer instructions
4. User sends transfer
5. Admin approves
6. Transaction becomes `approved`
7. Donation becomes `confirmed`

### Gateway Subscription Flow Later
1. User chooses plan
2. System creates:
   * `subscription` with status `pending`
   * `payment_transaction` with status `pending_payment`
3. User pays through gateway
4. Webhook marks transaction `approved`
5. Subscription becomes `active`
6. Entitlements become `pro`

This is why `payment_transaction` must exist as a first-class model even now.

## 5. Architecture Layers
### Layer 1: Product Layer
Responsible for:
* pricing pages
* transfer instructions page
* subscription status page
* upgrade prompts

Files should stay in:
* `src/features/support`
* `src/features/settings`

### Layer 2: Domain Layer
Responsible for:
* plan rules
* subscription lifecycle
* transaction state transitions
* donation confirmation
* entitlement calculation

Recommended location:
* `src/features/billing/server`

### Layer 3: Provider Layer
Responsible for:
* manual bank transfer instructions
* future payment gateway integration
* webhook adapters

Recommended location:
* `src/features/billing/providers`

This provider layer should expose a stable internal interface like:

* `createPaymentIntent()`
* `getTransferInstructions()`
* `handleProviderCallback()`
* `approveManualTransaction()`

## 6. Recommended Folder Structure
Suggested long-term structure:

```txt
src/features/billing/
  api/
  components/
  constants/
  providers/
    manual-bank-transfer.ts
    midtrans.ts
    xendit.ts
  server/
    billing-data.ts
    subscription-service.ts
    transaction-service.ts
    entitlement-service.ts
    admin-approval-service.ts
  types.ts
```

For now, `src/features/support` can continue to host the UI, but the logic should gradually move toward `billing`.

## 7. Recommended API Surface
### User-Facing APIs
* `POST /api/support/subscription`
  * create pending subscription + transaction
* `POST /api/support/donation`
  * create pending donation + transaction
* `GET /api/support/transfer/:id`
  * return transfer instructions and transaction status
* `POST /api/support/proof`
  * optional proof upload or proof metadata

### Admin APIs
* `POST /api/support/admin/approve`
* `POST /api/support/admin/reject`
* `GET /api/support/admin/pending`

### Future Gateway APIs
* `POST /api/billing/checkout`
* `POST /api/billing/webhook`

## 8. Recommended Database Direction
### What to Keep
Your current `supporter_subscriptions` table is a good start.

### What to Add Next
Add a dedicated `payment_transactions` table.

This is the main missing piece today.

Why it matters:
* one subscription can have multiple payments over time
* manual transfer and gateway payment should both write to the same concept
* approval and proof review belong to transaction history
* admin workflow becomes clean

Suggested relationship:
* `subscription` 1-to-many `payment_transactions`
* `donation` 1-to-1 or 1-to-many `payment_transactions`

## 9. Entitlement Strategy
The app should not ask:
* “Did this user ever pay?”

It should ask:
* “What is this user’s current entitlement?”

Recommended rule:
* `subscription.status === active` means `Pro`
* otherwise user is `Free`

Future rule:
* entitlement may be computed from subscription state and stored as a snapshot for fast checks

Recommended enforcement points:
* memorize goal creation
* khatam plan creation
* advanced analytics access
* premium reminder access

## 10. Admin Workflow
For manual transfer to work operationally, admin needs:

* a list of pending subscription requests
* a list of pending donation requests
* transaction amount
* user identity
* request reference code
* proof of transfer if available
* approve / reject actions

Without this, manual payment will become operationally painful very quickly.

Recommended admin actions:
* `approve`
* `reject`
* `mark expired`
* `request more info`

## 11. User Experience Recommendation
### For Manual Flow
Use this wording:
* `Continue to Transfer`
* `Manual bank transfer activation`
* `Your Pro access becomes active after transfer approval`

Do not use:
* `Subscribe now` if activation is not immediate
* `Recurring subscription` if no automatic renewal exists yet

### For Gateway Flow Later
Then you can use:
* `Start Subscription`
* `Instant activation`
* `Renews automatically`

## 12. Recommended Rollout
### Phase 1: Manual Transfer MVP
Ship:
* pending subscription creation
* transfer instructions page
* admin approval
* pending vs active states
* settings subscription status

### Phase 2: Operational Safety
Add:
* proof upload
* pending transaction list for admin
* rejection flow
* expiration rules
* audit history

### Phase 3: Gateway Integration
Add:
* payment gateway provider
* webhooks
* instant activation
* renewal handling
* failed payment recovery

### Phase 4: Subscription Maturity
Add:
* cancel at period end
* renewal invoices
* retry and past-due states
* provider reconciliation

## 13. Recommendation for Qurafy Right Now
Best practical approach:

* keep manual bank transfer now
* rename it internally as `manual activation flow`
* do not treat it as full recurring billing yet
* add `payment_transactions` next
* add admin review UI next
* design gateway support behind a provider abstraction

## 14. Final Architecture Decision
Recommended final architecture:

* `Plan` defines what can be bought
* `Subscription` defines Pro lifecycle
* `PaymentTransaction` defines how payment is attempted and approved
* `Donation` defines one-time charitable support
* `Entitlement` defines what the app unlocks

This is the safest architecture because:
* manual transfer works now
* gateway integration fits later
* free vs pro checks stay stable
* support, accounting, and product logic stay separated

## 15. Next Implementation Priority
If continuing from the current codebase, the next best step is:

1. add `payment_transactions`
2. add proof-upload support
3. add admin pending-review page
4. enforce Free vs Pro entitlements in memorize/khatam creation
5. only then integrate a payment gateway
