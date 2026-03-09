# PRD: Qurafy Pro Subscription Feature

**Feature Name:** Qurafy Pro Subscription  
**Status:** Draft  
**Platform:** Web Application (Responsive)  
**Last Updated:** March 9, 2026

---

## 1. Problem Statement
Qurafy wants to introduce monetization through `Qurafy Pro`, yearly support, and donations while the product currently relies on Quran content fetched from Quran Foundation's API (`api.quran.com`).

This creates a product and compliance question:
* how to monetize without turning third-party Quran API content into the paid product,
* how to keep core Quran access free,
* how to separate platform support from sadaqah clearly,
* how to reduce the risk of violating API terms for commercial use.

## 2. Goal
Launch a subscription and support model that is commercially viable for Qurafy while keeping the monetization structure compatible with third-party Quran API usage.

Primary goal:
* users pay for Qurafy's product layer and premium experience, not for access to the Quran text itself.

## 3. Recommended Business Model
Recommended structure:
* `Free` gives access to core Quran reading and basic app usage.
* `Qurafy Supporter Monthly 70/30` includes Pro access, allocates `70%` to Qurafy operations, and `30%` to charity.
* `Qurafy Supporter Yearly 70/30` is the discounted annual version of the supporter plan.
* `Sadaqah` remains a separate charitable flow and must not be mixed with subscription language.

Recommended principle:
* sell the workflow, convenience, tracking, and premium experience through the supporter plan
* use the `70/30` split as an explicit supporter promise, not vague donation language
* do not sell the Quran API content itself

## 4. Why This Is the Safer Direction
Qurafy currently fetches Quran content from Quran Foundation's API in [`src/features/read/server/quran-api.ts`](/Users/dwifahmi/projects/qurafy/src/features/read/server/quran-api.ts).

Based on Quran Foundation's current public developer terms and docs:
* commercial use of Quran Foundation content can require separate written permission or a commercial license,
* raw API content should not be treated as your own proprietary paid dataset,
* caching and storage are constrained,
* access is expected to be registered and controlled.

This means the safer model is:
* free access to Quran reading content,
* paid access to Qurafy-owned premium features built around that content.

## 5. Non-Goals
* Paywalling Quran text, surah list, juz list, or basic reading access
* Selling raw Quran Foundation API responses or downloads
* Presenting donations as if they grant ownership, blessings, or religious advantage
* Mixing `Sadaqah` with normal operating revenue in unclear ways
* Launching a monetization model before verifying provider permission

## 6. Product Positioning
Recommended public positioning:
* `Qurafy Free`: Read, explore, and build your daily Quran habit
* `Qurafy Supporter 70/30`: Includes Pro access and combines platform support with a defined charity allocation
* `Pure Sadaqah`: Separate charitable giving flow

Recommended messaging:
* the supporter plan includes Pro access and uses a transparent `70/30` allocation
* sadaqah is a dedicated charity flow

Avoid messaging like:
* pay to unlock Quran access
* subscribe to access surahs or verses
* premium Quran content
* ambiguous wording that makes the supporter plan sound like Pure Sadaqah

## 7. Free vs Paid Boundaries
### Must Stay Free
These features are safest to keep in the free tier:
* basic Quran reading by surah and juz
* Quran text rendering
* basic translation display
* basic transliteration display
* basic continue reading
* basic bookmark or reading position
* basic memorization access if it directly depends on Quran API verses

### Safe Candidates for Pro
These are safer to monetize because they are Qurafy's own product layer:
* advanced memorization planning
* multiple active memorization goals
* advanced streaks and analytics
* historical charts and insight summaries
* custom study plans
* premium reminders and habit automation
* advanced session statistics
* cloud sync priority or richer backup/history
* premium themes and personalization
* focus mode and distraction controls
* exclusive community perks not tied to Quran API content

Rule:
* the supporter plan may include these Pro capabilities, but the commercial value proposition should still be the Qurafy feature layer, not access to Quran content

### Higher-Risk Features
These features need caution or provider approval:
* premium reciter audio if sourced from third-party licensed content
* premium translations sourced from restricted licensors
* offline downloadable Quran datasets
* bulk export of Quran text, translations, or audio from third-party sources
* charging specifically for access to Quran verses or translations

## 8. Subscription Tiers
### Free
Includes:
* read Quran by surah and juz
* basic translation and transliteration
* basic dashboard stats
* one active memorization goal
* basic continue reading

### Qurafy Supporter Monthly 70/30
Includes:
* everything in Free
* unlimited memorization goals
* advanced dashboard analytics
* richer progress history
* custom study plans and reminders
* premium personalization
* premium support/community perks
* clear `70%` allocation to Qurafy operations
* clear `30%` allocation to charity

### Qurafy Supporter Yearly 70/30
Includes:
* everything in Supporter Monthly
* discounted annual billing
* optional founder/supporter badge if desired
* larger annual support commitment

### Sadaqah
Includes:
* no product entitlement
* fully separate accounting and messaging from subscription revenue

## 9. UX and Messaging Requirements
The monetization UX must:
* clearly distinguish `Supporter 70/30` and `Sadaqah`
* explain that the supporter plan includes Pro tools, not Quran ownership or exclusive scripture access
* avoid dark patterns or religious pressure language
* be transparent that `70%` supports Qurafy and `30%` is allocated to charity
* explain that `Pure Sadaqah` is the separate 100% charitable route

Suggested CTA language:
* `Choose a 70/30 supporter plan`
* `Support Qurafy and unlock Pro access`
* `See your 70/30 allocation`
* `Give Pure Sadaqah`

## 10. Compliance Guardrails
Before launch:
* confirm Quran Foundation's current terms again
* request written approval for Qurafy's monetized use case
* verify whether commercial use needs a separate license
* verify attribution, caching, and access credential requirements

Ongoing guardrails:
* do not resell raw API content
* do not market Quran Foundation content as proprietary premium inventory
* keep provider attribution where required
* review caching behavior against provider rules
* document third-party content sources for text, translations, and audio
* keep accounting records that can support the promised `70/30` allocation

## 11. Engineering Requirements
The implementation should:
* store subscription state independently from Quran content access
* use feature flags or entitlements for supporter-plan product features
* avoid putting Quran API reads behind a Pro-only access check
* make room for provider-specific attribution and policy updates
* support monthly and yearly billing cycles cleanly
* support the `70/30` allocation model in billing/accounting
* support a separate sadaqah flow

Recommended entitlement groups:
* `free_core`
* `supporter_pro_access`
* `supporter_badge`
* `sadaqah_only`

## 12. Content Source Risk Matrix
### Low Risk
* charging for analytics
* charging for planning tools
* charging for UI personalization
* operating a clearly disclosed supporter plan with transparent accounting

### Medium Risk
* supporter-plan monetized memorization workflow that depends on Quran API verses
* premium reminders or study modes that are tightly coupled with provider content

### High Risk
* paywalling Quran text
* paywalling translation sourced from third parties
* selling offline Quran content packages
* redistributing raw provider data commercially without permission

## 13. Rollout Plan
### Phase 1
* keep existing free reading experience intact
* define supporter-plan entitlements around non-content features
* clean up pricing copy to distinguish `70/30 Supporter` and `Pure Sadaqah`

### Phase 2
* add monthly and yearly subscription plumbing
* gate only approved supporter-plan features
* define accounting/reporting for the `70/30` allocation
* add legal/policy review checklist before public release

### Phase 3
* launch supporter plans with explicit attribution and compliant messaging
* monitor provider limits, caching, and support requests
* revise if provider requests changes

## 14. Open Questions
* Should basic memorization stay fully free, with advanced planning in Pro?
* Should supporter badges come from subscription, donation, or both?
* Will premium audio use a separate licensed source?
* Will yearly supporters receive only billing savings, or distinct perks too?
* Does Quran Foundation require explicit written approval for this exact use case?

## 15. Recommended Decision
Recommended decision for Qurafy:
* proceed with `Free + Supporter Monthly 70/30 + Supporter Yearly 70/30 + separate Sadaqah`
* keep Quran reading and basic scripture access free
* use the supporter plan to monetize Qurafy's own productivity, habit, analytics, and personalization features
* make the `70/30` allocation explicit in product copy and accounting
* get written approval from Quran Foundation before public launch of paid plans

## 16. Source References
Current external references reviewed on March 9, 2026:
* Quran Foundation Developer Terms: https://api-docs.quran.foundation/legal/developer-terms/
* Quran Foundation Quick Start: https://api-docs.quran.foundation/docs/quickstart/
* Quran Foundation Request Access: https://api-docs.quran.foundation/request-access/
