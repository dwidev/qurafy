# Performance Audit

## Summary

The project feels slow for four main reasons:

1. Local development uses the slower webpack dev server instead of Turbopack.
2. Core app pages fetch their own data on the client after hydration instead of rendering that data on the server.
3. The dashboard aggregates multiple data sources and can trigger external Quran API requests before real content appears.
4. Global animation effects are mounted too high in the tree and run more often than necessary.

Production build speed is not the main problem. A production build completed successfully in about 2.4s, so the heavier issue is runtime architecture and client rendering strategy.

## Main Bottlenecks

### 1. Slow local dev mode

File: `package.json`

- `npm run dev` uses `next dev --webpack`
- `npm run dev:turbo` uses `next dev`

Impact:

- Hot reload and route compilation feel slower than they need to.
- This makes the whole project feel worse during development even if production is acceptable.

Recommendation:

- Change the default `dev` script to `next dev`.
- Keep a separate webpack fallback only if there is a verified compatibility issue.

## 2. Client-side data fetching on core pages

Affected pages:

- `src/features/dashboard/components/DashboardPage.tsx`
- `src/features/read/components/ReadQuranPage.tsx`
- `src/features/read/components/ReaderPage.tsx`
- `src/features/profile/components/ProfilePageClient.tsx`

Pattern:

- Page renders a skeleton first.
- Browser downloads and hydrates JS.
- Client then requests `/api/*`.
- Real content appears only after that extra round trip.

Why this is expensive:

- It adds a waterfall: HTML -> JS -> hydration -> API -> content.
- It prevents App Router from doing the first useful render on the server.
- Users experience loading states even for data that already lives in the same app/backend.

Recommendation:

- Move primary data loading to server components for dashboard, read, reader, profile, memorize, tracker, and settings pages.
- Use React Query mainly for mutations, live refreshes, or background revalidation.
- If React Query is still needed, hydrate it with `initialData` from the server instead of forcing a client-only fetch path.

## 3. Dashboard request is expensive

Main flow:

- `src/app/api/dashboard/me/route.ts`
- `src/features/dashboard/server/dashboard-data.ts`

What happens:

- Dashboard loads profile stats.
- Dashboard loads memorize data.
- Dashboard loads khatam data.
- Dashboard may also load Quran content again for the highlighted khatam target.

Additional cost:

- `getMemorizeMeData()` already calls Quran read APIs for surah metadata/content.
- `getQuranReadContentData()` may fetch multiple external pages of verses for range reads.

Why this hurts:

- A single dashboard request depends on multiple DB queries plus external network calls.
- The client only starts this work after hydration because the dashboard is currently client-fetched.
- External API latency is outside your control, so it directly affects perceived speed.

Recommendation:

- Render dashboard data on the server.
- Split dashboard payload into critical and non-critical sections.
- Keep quick stats and primary CTA in the initial payload.
- Defer secondary data with Suspense or background loading.
- Cache repeated Quran API lookups more aggressively and avoid recomputing content for the same range/surah.

## 4. External Quran API dependency is in the hot path

Main file:

- `src/features/read/server/quran-api.ts`

Current behavior:

- Reads from `https://api.quran.com/api/v4`
- Fetches chapter list, juz list, chapter content, and range content
- Range content can fan out to several requests with `Promise.all`

Why this hurts:

- Even with revalidation, first-hit latency can be noticeable.
- Dashboard and memorize flows depend on this data, so unrelated screens inherit Quran API cost.
- If the external API is slow, your app appears slow.

Recommendation:

- Separate "metadata needed for UI" from "full verse payload needed for reading".
- Cache metadata and frequently used surah/range responses more aggressively.
- Avoid loading full verse content on screens that only need small excerpts.
- Consider storing minimal Quran metadata locally if the app uses it constantly.

## 5. Global client effects add constant work

Affected files:

- `src/app/layout.tsx`
- `src/components/shared/LandingCursor.tsx`
- `src/app/(landing)/layout.tsx`
- `src/components/shared/StarryBackground.tsx`
- `src/components/shared/ScrollAnimator.tsx`

What is happening:

- `LandingCursor` is mounted in the root layout for the whole app.
- It uses a fullscreen canvas, `requestAnimationFrame`, pointer listeners, resize listeners, particle creation, and per-frame drawing.
- Marketing pages also mount `StarryBackground`, another animated canvas, plus `ScrollAnimator`.

Why this hurts:

- Every app route pays for cursor behavior even when it is not needed.
- Canvas animation and per-frame work increase CPU and battery use.
- The UI can feel heavy even if network latency is not the main issue.

Recommendation:

- Move `LandingCursor` out of the root layout and mount it only on the landing/marketing segment if it is part of the brand experience.
- Respect `prefers-reduced-motion`.
- Cache computed theme values instead of reading styles repeatedly in animation loops.
- Reduce per-frame allocations and particle churn.

## Priority Fix Order

### P0

- Change `npm run dev` from webpack to Turbopack.
- Remove debug `console.log` calls from `src/features/dashboard/api/client.ts`.
- Move dashboard page data fetching to the server.

### P1

- Move read list and reader content fetching to server components.
- Move profile/settings initial fetches to the server.
- Keep React Query for mutations and targeted refetching only.

### P2

- Reduce dashboard payload cost by splitting critical vs non-critical data.
- Stop fetching full Quran verse content where only short excerpts are needed.
- Add stronger caching or local storage of stable Quran metadata.

### P3

- Scope animations to the landing experience only.
- Reduce animation overhead and add motion fallbacks.

## Concrete Refactor Direction

### Dashboard

- Replace client-only `useDashboardMeQuery()` page loading with a server component that calls server functions directly.
- Optionally hydrate React Query with server-provided data if later mutations need the same cache.

### Read pages

- Load read list and reader content in server components.
- Keep local reading settings in the client, but do not block content on a client fetch.

### Profile and settings

- Fetch profile and settings data in the route on the server.
- Pass only the minimal serialized payload to client UI components.

### Quran data

- Cache chapter/juz metadata separately from verse payloads.
- Avoid using range verse fetches for cards that only need a short Arabic preview.

### UI effects

- Restrict animated background/cursor effects to marketing routes.
- Avoid mounting global canvas effects for authenticated app routes.

## Expected Wins

- Faster local development and refresh cycles.
- Less skeleton-first behavior on authenticated pages.
- Better first render and time-to-content.
- Lower dependency on external Quran API latency for dashboard interactions.
- Less CPU usage on navigation and idle screens.

## Recommended First Implementation

If fixing this incrementally, start here:

1. Change the default dev script to Turbopack.
2. Convert `/app` dashboard from client-fetched data to server-rendered data.
3. Move `LandingCursor` out of the root layout.
4. Convert `/app/read` and `/app/read/[id]` to server-first data loading.

This sequence gives the largest perceived performance improvement with the smallest architectural churn.
