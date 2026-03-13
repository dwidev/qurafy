# PRD: Qurafy Free vs Pro Entitlements

**Feature Name:** Free vs Pro Product Definition  
**Status:** Draft  
**Platform:** Web Application (Responsive)  
**Last Updated:** March 13, 2026

---

## 1. Problem Statement
Qurafy needs a monetization boundary that is clear to users, sustainable for the product, and aligned with the app's religious purpose.

Right now the risk is not only billing complexity. The bigger risk is product confusion:
* if too much is free, Pro feels weak,
* if core worship flows are paywalled, the app feels spiritually hostile,
* if free users must choose only one core feature such as `memorize` or `khatam`, the product feels incomplete before it feels useful,
* if `subscription`, `supporter`, and `sadaqah` are not clearly separated, users will not trust the model.

Qurafy needs a simple rule:
* keep the core Quran journey free,
* charge for depth, scale, convenience, and premium workflow support.

## 2. Product Goal
Define a tier model that:
* preserves generous free access to Quran reading and habit-building,
* creates a meaningful reason to upgrade to Pro,
* avoids forcing free users to choose between `memorize` and `khatam`,
* supports monthly and yearly supporter plans with the same entitlements,
* keeps `Pure Sadaqah` fully separate from subscription benefits.

## 3. Product Principle
Recommended principle for Qurafy:
* `Free` should be complete enough for sincere daily use.
* `Pro` should make committed users more effective, consistent, and supported.
* monthly and yearly plans should differ only in billing cycle and pricing, not in feature access.
* sadaqah should not grant product entitlements.

Important decision:
* free users should **not** be forced to choose only one of `memorize` or `khatam`.
* instead, free users should get limited access to both:
  * `1 active memorization goal`
  * `1 active khatam plan`

This gives real value without collapsing the upgrade path.

## 4. Non-Goals
* Paywalling Quran reading itself
* Paywalling basic translation or transliteration
* Making the free plan feel broken on first use
* Creating different feature entitlements for monthly vs yearly Pro
* Mixing subscription access with charitable giving

## 5. Tier Definitions
### Free
Free is the default plan for every signed-in user.

It should allow a user to:
* read Quran normally,
* maintain a daily habit,
* start memorization,
* maintain a khatam journey,
* personalize basic reading settings.

### Pro
Pro is the supporter tier unlocked through either:
* `Qurafy Supporter Monthly 70/30`
* `Qurafy Supporter Yearly 70/30`

Both monthly and yearly Pro include the same product access.

### Pure Sadaqah
Pure Sadaqah is a separate donation flow.

It should:
* not unlock Pro,
* not grant a plan badge by default,
* remain clearly distinct in UI copy, accounting, and user expectations.

## 6. Recommended Free vs Pro Matrix
| Area | Free | Pro |
|---|---|---|
| Quran reading | Full basic reading access | Same as Free |
| Translation and transliteration | Included | Included |
| Continue reading | Included | Included |
| Reader settings | Basic settings | Same as Free |
| Dashboard summary | Basic stats | Richer stats and insights |
| Memorization goals | 1 active goal | Multiple active goals |
| Memorization session history | Basic current progress | Rich history and deeper stats |
| Khatam plans | 1 active plan | Multiple active plans |
| Khatam progress history | Basic current plan view | Rich history and archived insights |
| Reminders | Basic reminders | Smarter reminders and automation |
| Analytics | Minimal | Advanced charts, trends, and streak insights |
| Personalization | Basic theme and reader controls | Premium personalization and supporter badge |
| Supporter identity | None | Pro badge and supporter status |

## 7. Detailed Entitlement Rules
### Must Stay Free
These should remain free because they are core to the product's trust and usefulness:
* reading Quran by surah and by page flow already present in the app,
* translation and transliteration toggles,
* continue reading,
* profile and settings access,
* daily usage of both `memorize` and `khatam`,
* one active memorization goal,
* one active khatam plan.

### Should Be Pro
These are the strongest candidates for monetization because they add depth rather than basic access:
* more than one active memorization goal,
* more than one active khatam plan,
* archived goal history and richer progress history,
* deeper analytics and trend views,
* premium reminders and study automation,
* supporter badge and supporter-facing subscription status,
* future premium planning tools and productivity features.

### Should Not Be Used as the Main Paywall
Avoid using these as the primary upgrade trigger:
* raw Quran reading access,
* translation access,
* a forced choice between `memorize` and `khatam`,
* account settings or profile editing,
* a basic streak or a basic dashboard.

## 8. Core Decision for Memorize and Khatam
Recommended decision:
* Free users get both `memorize` and `khatam`.
* Free users are limited by active depth, not feature existence.

Implementation rule:
* Free user can create:
  * `1 active memorization goal`
  * `1 active khatam plan`
* Pro user can create:
  * multiple active memorization goals
  * multiple active khatam plans

Why this is better:
* users experience the full Qurafy value loop,
* the product does not feel artificially blocked,
* the upgrade path is still obvious for serious users,
* the limit is easy to explain and easy to enforce technically.

## 9. Subscription UX Requirements
The app should clearly show:
* current plan: `Free` or `Pro`,
* if Pro, visible billing flag: `Monthly` or `Yearly`,
* what Free users already get,
* what Pro adds beyond Free,
* links to upgrade or manage the supporter plan.

The app should never imply:
* Quran access itself is the paid product,
* donation and subscription are interchangeable,
* monthly Pro and yearly Pro have different core features.

## 10. Upgrade Triggers
Recommended upgrade triggers:
* user tries to create a second memorization goal,
* user tries to create a second khatam plan,
* user opens advanced analytics or archived history,
* user wants premium reminders or supporter-only personalization.

Recommended upgrade copy:
* `Free includes 1 active memorization goal and 1 active khatam plan. Upgrade to Pro for more active plans, richer insights, and supporter benefits.`

Avoid copy like:
* `Choose memorize or khatam`
* `Upgrade to unlock Quran features`
* `Subscribe to access the Quran`

## 11. Engineering Requirements
The system should model entitlements explicitly rather than infer them from generic payment history.

Recommended entitlement shape:
* `plan_type`: `free` or `pro`
* `billing_cycle`: `monthly`, `yearly`, or `null`
* `memorize_active_limit`
* `khatam_active_limit`
* `has_advanced_analytics`
* `has_premium_reminders`
* `has_supporter_badge`

Recommended V1 default values:
* Free
  * `memorize_active_limit = 1`
  * `khatam_active_limit = 1`
  * `has_advanced_analytics = false`
  * `has_premium_reminders = false`
  * `has_supporter_badge = false`
* Pro
  * `memorize_active_limit = unlimited`
  * `khatam_active_limit = unlimited`
  * `has_advanced_analytics = true`
  * `has_premium_reminders = true`
  * `has_supporter_badge = true`

## 12. Enforcement Rules
When a user is Free:
* block creation of a second active memorization goal,
* block creation of a second active khatam plan,
* allow existing active item completion and normal usage,
* show an upgrade explanation instead of a generic error.

When a user is Pro:
* allow multiple active goals and plans,
* show supporter status and billing-cycle badge in settings/subscription UI.

When a subscription expires:
* do not delete existing data,
* keep historical goals and plans,
* prevent creation of new active items above the Free limit,
* allow completion or closure of already-active items depending on final policy.

Recommended downgrade rule:
* if a Pro user downgrades while having more than one active item, mark excess items as read-only until they reduce back to Free limits.

## 13. Rollout Plan
### Phase 1
* finalize Free vs Pro rules,
* ship Subscription settings UI,
* keep billing cycle visible for Pro users,
* keep all existing core features usable while backend entitlements are still simple.

### Phase 2
* add explicit entitlement fields in backend models,
* enforce active-goal and active-plan limits,
* add upgrade prompts on the relevant actions.

### Phase 3
* add advanced analytics and premium reminders,
* move Pro value from placeholder messaging into real differentiated features.

## 14. Success Criteria
* users can easily understand what `Free` includes,
* users can easily understand what `Pro` adds,
* free users do not feel forced to choose between `memorize` and `khatam`,
* upgrade triggers happen at natural moments of commitment,
* Pro feels meaningfully better without making Free feel broken.

## 15. Recommended Decision
Recommended final decision for Qurafy:
* keep Quran reading free,
* keep both `memorize` and `khatam` available in Free,
* limit Free to `1 active memorization goal` and `1 active khatam plan`,
* use Pro to unlock scale, analytics, automation, and supporter identity,
* treat monthly and yearly as the same Pro plan with different billing cadence,
* keep `Pure Sadaqah` completely separate from product access.
