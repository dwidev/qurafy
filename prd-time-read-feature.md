# PRD: Dynamic Time Read Tracking

**Feature Name:** Dynamic Time Read Tracking  
**Status:** Draft  
**Platform:** Web Application (Responsive)  
**Last Updated:** March 8, 2026

---

## 1. Problem Statement
The dashboard currently calculates `Time Read` using a fixed estimate derived from completed verses. This is not an accurate reflection of real user behavior.

Current issues:
* users can spend a long time reading a few verses but get a low `Time Read` value,
* users can complete memorization quickly but spend much longer repeating and practicing,
* users who spend time on read or memorize pages without completing verses get no meaningful credit,
* dashboard stats are based on inferred output, not actual engagement time.

The product needs a real activity-based time metric for reading and memorization.

## 2. Goal
Track how long an authenticated user actively spends on supported read and memorize pages, then use that tracked time to power the dashboard `Time Read` metric.

Tracked routes in V1:
* `/app/read`
* `/app/read/[id]`
* `/app/memorize`
* `/app/memorize/session`

## 3. Non-Goals
* Tracking activity on unrelated pages such as settings or profile
* Passive background tracking when the tab is hidden
* Camera or microphone-based attention tracking
* Retroactively reconstructing historical time from old data
* Public leaderboards or social ranking in this phase

## 4. User Stories
* As a user, I want my dashboard time to reflect my real reading and memorization effort.
* As a user, I do not want accidental short visits to inflate my stats.
* As a product team, we want a reusable engagement signal for analytics and future features.

## 5. Success Criteria
* Dashboard `Time Read` is sourced from tracked active time, not estimated verse count.
* Time is recorded for both read and memorize flows.
* Idle, hidden, or abandoned sessions do not overcount significantly.
* Dashboard updates after the user leaves a tracked page and returns.

## 6. Functional Requirements
* The system must create or resume a tracked session when a signed-in user enters a supported route.
* The system must count only active foreground time.
* The system must pause or stop counting when:
  * the tab becomes hidden,
  * the route changes away from a tracked page,
  * the page unloads,
  * the user has been idle for longer than the configured threshold.
* The system must periodically persist active time to the backend during long sessions.
* The system must send a final flush before page exit where possible.
* The system must ignore very short micro-sessions below a minimum threshold.
* The dashboard must aggregate tracked seconds into a formatted hours-and-minutes label.

## 7. UX Requirements
* Tracking is automatic and silent for authenticated users.
* No persistent timer UI is required in V1.
* Dashboard values should feel fresh after returning from reading or memorization.
* Future UI enhancements such as a subtle “session active” marker are out of scope for V1.

## 8. Tracking Rules
* Track authenticated users only.
* Count time only when the page is visible.
* Count time only on supported tracked routes.
* Reset idle status on meaningful interaction:
  * scroll,
  * click,
  * touch,
  * key press,
  * audio control interaction.
* Recommended idle timeout: `60-90` seconds.
* Recommended heartbeat interval: `30-60` seconds.
* Recommended minimum persisted session duration: `10` seconds.

## 9. Proposed Data Model
Recommended new table: `activity_sessions`

Suggested fields:
* `id`
* `user_id`
* `feature_type` with values such as `read` and `memorize`
* `route`
* `content_id` nullable, for example `surah-2`, `juz-30`, or a memorize goal/session identifier
* `started_at`
* `last_seen_at`
* `ended_at` nullable
* `active_seconds`
* `is_completed`
* `created_at`
* `updated_at`

Recommended approach:
* store incremental active seconds on session rows rather than only raw event logs

Reason:
* simpler dashboard aggregation,
* easier debugging,
* easier final flush and retry behavior.

## 10. Backend Requirements
* Provide an authenticated endpoint to start or resume an activity session.
* Provide an authenticated heartbeat endpoint to update accumulated active time.
* Provide an authenticated finalize endpoint to close a session.
* Ensure users can only update their own sessions.
* Make writes tolerant to duplicate heartbeats and duplicate final flushes.
* Aggregate total tracked seconds per user for dashboard consumption.

## 11. Frontend Requirements
* Build a shared client tracking hook usable by read and memorize pages.
* The hook should:
  * start or resume a session on mount,
  * send heartbeat updates on an interval,
  * listen for `visibilitychange`,
  * stop or pause on unmount,
  * flush on route exit and `pagehide`.
* Read pages should pass page context such as content id, surah id, or juz id.
* Memorize pages should pass goal or session context where available.

## 12. Dashboard Requirements
* Replace the current formula based on completed verses.
* Use aggregated tracked seconds as the source of truth.
* Format time into `Xh Ym`.
* Show `0h 0m` if no tracked time exists.
* Invalidate or refresh dashboard cache after tracked-session flushes so stats feel current.

## 13. Edge Cases
* Multiple tracked tabs open at once
  * V1 recommendation: allow it, but avoid obvious double-counting where feasible
* Network loss during a session
  * queue final flush attempts or rely on periodic heartbeat persistence
* Abrupt browser close
  * rely on `pagehide` plus heartbeat intervals to reduce lost time
* Long inactive page stay
  * stop counting after idle timeout and resume only after interaction
* Rapid switching between read and memorize pages
  * close the previous route session and start a new one cleanly

## 14. Analytics Opportunities
Track:
* daily reading minutes,
* daily memorization minutes,
* average active session length,
* median active session length,
* dashboard time-read trust/accuracy feedback,
* comparison between estimated time and tracked time during rollout.

## 15. Rollout Plan
### Phase 1
* add schema and backend endpoints,
* ship silent tracking on read and memorize pages,
* keep old dashboard estimate for internal comparison only.

### Phase 2
* switch dashboard `Time Read` to tracked seconds,
* verify cache refresh and aggregation behavior.

### Phase 3
* add internal monitoring/debugging tools,
* evaluate whether streaks should later incorporate active minutes.

## 16. Open Questions
* Should `/app/tracker` also count toward `Time Read` in V1?
* Should audio listening without interaction count as active time?
* Should a single session have a hard cap to prevent abuse or runaway tabs?
* Should dashboard later split `Reading Time` and `Memorization Time` instead of combining them?
