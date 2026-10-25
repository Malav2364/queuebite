# QueueBite Product Specification

**Document type:** Product requirements, functional specification, and technical architecture  
**Status:** Working baseline for implementation  
**Last updated:** 2026-10-24  
**Product name:** QueueBite

> This document consolidates the QueueBite research brief and the technology decisions made in planning. Features are classified as MVP, next phase, or future. Unresolved policies are marked **Decision needed** rather than silently invented.

## 1. Product overview

QueueBite is a restaurant discovery and queue-management product that helps diners make better decisions about where to eat, join a participating restaurant's virtual waitlist, follow a live wait estimate, coordinate a group, and optionally pre-order food timed to their seating. Restaurants use a web dashboard to manage walk-ins and remote queue entries together, assign tables, communicate with guests, and understand service performance.

Its central promise is not merely “join a digital line”; it is **understand the likely total time to be seated and keep the customer and restaurant synchronized as conditions change**.

### Product surfaces
- **Customer mobile app:** iOS and Android using React Native and Expo.
- **Restaurant/staff dashboard:** browser application, optimized for tablets and desktop.
- **Public/PWA entry points:** QR codes and shareable web links are planned access paths. A standalone PWA is a later delivery decision, not assumed in the first release.
- **Kitchen workflow:** queue-aware pre-order timing is a planned differentiator. A full kitchen display system is not required for the first MVP.
- **Messaging fallback:** SMS and a possible WhatsApp Business flow for users who do not install the app. WhatsApp automation is not MVP scope.

### Product goals
1. Let diners discover participating restaurants and compare current wait ranges.
2. Let diners join, track, and leave a virtual queue.
3. Combine online entries and staff-entered walk-ins in one authoritative queue.
4. Give restaurant staff safe, fast queue and table operations.
5. Keep customers informed through real-time updates and notifications.
6. Establish measurable wait-time prediction quality.
7. Create a foundation for group dining, smart restaurant selection, and queue-aware pre-ordering.

### Non-goals for the first MVP
- Replacing a restaurant's POS or full reservation system.
- Guaranteed exact seating times. Estimates are ranges and can change.
- Building a custom ML platform before enough operational data exists.
- Payments, split bills, loyalty currency, camera-based table detection, or hardware integrations.
- Multi-city enterprise complexity before a single-location pilot works reliably.

## 2. Users, roles, and permissions

### Customer / diner
Can create an account, manage their profile, browse participating restaurants, join a queue with a party size, view queue status and estimated wait range, cancel their own eligible active entry, confirm arrival or report delay if enabled, receive notifications, browse menus and pre-order when enabled, and start or join a group session in a later phase.

Cannot seat themselves, change authoritative queue position or ETA, change restaurant capacity/table status, or access another customer's private information or order.

### Restaurant staff
Depending on assigned permissions, staff can view the active queue and table statuses, add walk-ins, update arrival/check-in status, seat a party and assign a table, mark tables occupied/cleaning/available, mark entries cancelled/completed/no-show, pause/resume online admission, and view basic shift metrics.

### Restaurant manager / owner
Includes staff capabilities plus restaurant profile, service hours, table inventory, queue settings, staff membership, menu/pre-order configuration when enabled, and historical analytics. Multi-location management is later scope.

### Platform administrator
May manage platform-wide support and operational settings with explicit, audited privileges. Admin access must never be granted from client-controlled values.

### Authentication vs authorization
- **Clerk** is the selected authentication provider for mobile and web.
- Mobile integration: `@clerk/expo`; dashboard integration: `@clerk/nextjs`, subject to compatibility checks against selected SDK versions.
- The Fastify API verifies Clerk-issued tokens for protected requests.
- PostgreSQL stores QueueBite-specific profiles and role/restaurant membership records linked to the Clerk user identifier.
- Roles and restaurant-specific permissions are enforced by the backend. A valid login does not imply staff privileges.
- Never trust a user ID, role, restaurant ID, or permission asserted only by the client.
- **Decision needed:** choose sign-in methods (phone OTP, email, Google/Apple, or a combination) based on conversion, provider support, regional SMS delivery, and cost.
- **Decision needed:** define account deletion, data export, and support recovery flows before public launch.

## 3. Core product concepts

- **Restaurant:** participating business with profile, service settings, tables, staff, and queue.
- **Queue:** ordered set of parties being considered for seating.
- **Queue entry / party:** one party's place in the queue, including party size, status, timestamps, and communication preferences.
- **Walk-in:** party added by staff at the restaurant.
- **Virtual queue entry:** party that joined through QueueBite or an approved remote entry point.
- **Table:** seating resource with capacity and operational status.
- **ETA / wait range:** prediction shown as a range, such as “18–25 minutes,” not a guarantee.
- **Group session:** shared planning session to coordinate several diners into one combined restaurant party.
- **Pre-order:** order submitted before seating whose preparation timing is coordinated with predicted seating.
- **Smart Table Finder / Smart Choice:** comparison of candidate restaurants using travel time and expected wait.
- **No-show:** party that does not arrive or respond within the configured restaurant policy.
- **Queue event:** recorded business event such as party joined, party seated, table freed, ETA recalculated, or queue paused.

## 4. Customer experience requirements

### 4.1 Discovery
Customer can browse participating restaurants in list or map form. Results should show, where data exists:
- Restaurant name, image/brand identity, cuisine/category, and short description.
- Distance or estimated travel time.
- Current wait range and whether the online queue is open.
- Party-size suitability and operating status/hours.
- Optional dietary, accessibility, and preference tags as those capabilities are introduced.

The UI must distinguish “wait at restaurant” from “travel time” and “total estimated time to seated.” Do not add them unless both estimates are available and clearly defined.

### 4.2 Join queue
1. Customer selects a participating restaurant.
2. Customer selects party size and provides required contact or party details.
3. Server validates restaurant availability, queue state, duplicate-entry policy, and party-size limits.
4. API creates one queue entry transactionally and returns its current status and wait range.
5. Customer sees confirmation and queue-status screen.
6. Repeated submissions must not create duplicate entries. Use idempotency protection for retryable mutations.

If the restaurant has paused online admission or is unavailable, explain that clearly and do not create an entry.

### 4.3 Queue status
Display restaurant and party details, queue-entry status, approximate parties ahead where appropriate, current wait range and last-updated context, readiness instructions, and actions available for the current state (cancel, confirm arrival, report delay).

The UI must tolerate transient disconnection. On reconnect, fetch an authoritative snapshot from the API before relying on incremental real-time events.

### 4.4 Notifications and arrival
Planned notifications include queue confirmation, approaching-turn notice, table-ready notice, cancellation/material delay updates, and optional reminders. Push uses Expo Notifications and Expo Push Service initially. SMS fallback may use a suitable regional provider. Delivery is not proof that a customer read a message.

Notification sending must be driven by committed backend state. Retries must avoid unnecessary duplicate messages. Store notification attempts/outcomes without logging secrets or unnecessary personal data.

### 4.5 Late arrival and cancellation
- Customer may report being late if enabled.
- API records the report and informs staff.
- Staff retain control of operational policy and seating order.
- Customer cancellation is permitted only for their own eligible active entry.
- **Decision needed:** grace period, no-show timeout, re-queue rules, and whether late parties retain their position. Prefer configurable restaurant policy rather than hard-coded behavior.

### 4.6 Menu and pre-order
Planned differentiator, not required for the first MVP:
- Customer browses menu and item availability.
- Customer adds items/modifiers to a cart linked to queue entry or group session.
- Restaurant/kitchen sees order and status.
- Preparation timing is calculated from estimated seating time and configured prep duration.
- ETA changes recalculate suggested prep start.
- Staff can pause, reject, or adjust prep when capacity or availability changes.
- Allergy/dietary notes must be treated carefully. Do not promise safe allergy accommodation unless the restaurant explicitly confirms it.
- Payments, refunds, tax, tips, split payments, and POS integration are out of initial scope until separately specified.

## 5. Group dining

**Phase:** post-MVP, after single-party queue reliability is proven.

1. Organizer creates a group session and selects a restaurant or candidate restaurants.
2. System creates a shareable link or QR code with an unguessable identifier.
3. Invitees join, enter required details, RSVP, and optionally add dietary preferences.
4. Group members may vote on restaurant options and contribute menu items when supported.
5. Organizer reviews final party size and confirms the combined party.
6. Restaurant receives one combined queue entry with group notes, not uncontrolled duplicate entries.
7. Group links must be scoped, protected against guessing, and revocable where practical.

**Decisions needed:** whether invitees need accounts; whether organizer can remove participants; how party-size changes work; how shared orders are finalized; and who is responsible for payment.

## 6. Smart Table Finder / Smart Choice

**Phase:** later MVP extension after wait data and restaurant coverage are credible.

Compare participating restaurants using:
- Estimated travel time from selected/current location.
- Current wait range.
- Party-size eligibility and queue-open status.
- Optional cuisine, budget, dietary, and accessibility preferences.

Example: Restaurant A is a 10-minute trip plus a 30–40-minute wait, so estimated total time is 40–50 minutes; Restaurant B is a 5-minute trip plus a 20–30-minute wait, so estimated total is 25–35 minutes. These are illustrative, not guarantees.

Rules:
- Label estimates and last update.
- Do not claim a restaurant is available if its queue state is unknown.
- Consider Google Maps Platform or Mapbox after cost, coverage, and licensing review.
- Do not automatically move a party between queues in the first implementation.
- Any future switch-queue feature must atomically cancel/transfer state and explain consequences.
- Location permission should be optional; allow manual location/search where feasible.

## 7. Restaurant dashboard

### 7.1 Overview
- Active queue with online entries and walk-ins together.
- Table occupancy and operational state.
- Current wait ranges.
- Quick actions for adding walk-ins and seating parties.
- Clear indication when online admission is paused.
- Last-updated/realtime connection state.

### 7.2 Queue operations
Staff actions: add walk-in, confirm/mark arrival, seat a party and assign table, mark party cancelled/completed/no-show, record operational notes, pause/resume online admission, and recover from accidental actions through a controlled audited path.

Every action is authorized server-side and validated against current state. Handle conflicts such as two staff members attempting to seat different parties at one table.

### 7.3 Table management
A table has a capacity and status, at minimum:
- Available
- Occupied
- Cleaning/turnover
- Temporarily unavailable

The server rejects assignments that conflict with capacity or current status. Detailed floorplans, sections, table combinations, and automatic optimization can follow later.

### 7.4 Kitchen/pre-order panel
Later phase: pending orders linked to queue entries, suggested prep start, prep/order status, warnings when ETA changes invalidate prep timing, and manual overrides with a recorded reason for important changes.

### 7.5 Analytics
MVP metrics: current queue size, average/median wait for a shift/day where data is sufficient, parties served, no-show/cancellation counts and rates, and basic peak-hour summaries.

Later metrics: historical comparisons/exports, table turnover duration, demand by time/day/location, staffing and throughput analysis, and multi-location reporting. Metrics should state time window and sample size where useful; avoid false precision with small samples.

## 8. Queue lifecycle and business rules

### 8.1 Suggested statuses
- `WAITING`: entry is active in the queue.
- `NOTIFIED`: approaching-turn/readiness notification issued; not yet seated.
- `ARRIVING`: customer acknowledged or reported they are on the way, if this state is needed.
- `SEATED`: party assigned a table and seating confirmed.
- `COMPLETED`: queue interaction finished.
- `CANCELLED`: party or staff cancelled the entry.
- `NO_SHOW`: party failed to arrive/respond under restaurant policy.

Finalize the state model during schema design. Transitions must be explicit, validated server-side, and recorded in history. Clients cannot arbitrarily set statuses.

### 8.2 Queue invariants
1. PostgreSQL is the authoritative source of truth for queue and table state.
2. Queue-changing actions execute in database transactions.
3. A table cannot be assigned to conflicting active parties.
4. A party cannot have multiple active entries at the same restaurant unless a deliberate rule permits it.
5. Online and walk-in parties appear in one operational queue.
6. All mutations are authorized and auditable.
7. Events and notifications are emitted only after the state change commits.
8. Retryable mutations are idempotent where duplication would cause harm.
9. Real-time messages indicate state changed; clients can refresh canonical state.
10. Redis is a cache/transport aid, not the source of truth.

### 8.3 Walk-in discipline
For ETA quality, staff must enter walk-ins and table-state changes into QueueBite. If parties or table clears are omitted, predictions become unreliable. Make this requirement visible during restaurant onboarding.

### 8.4 Concurrency and recovery
- Protect seat/table mutations with transactions and appropriate constraints/locking.
- Return clear conflict responses when a table is no longer available.
- Record who performed a mutation and when.
- On realtime disconnect, reload state.
- Retry notification delivery with bounded policy and expose status to operations.
- Introduce a transactional outbox when reliable event/notification processing is needed, so committed changes are not lost between the database and async workers.

## 9. Wait-time estimation

### 9.1 Initial approach
Start with an explainable statistical baseline, not an ML service. Use historical wait distributions/percentiles and simple operational adjustments, segmented where data allows by restaurant, party size, weekday, and time of day.

Display ranges rather than falsely precise single numbers. If data is insufficient, label the estimate preliminary or use a conservative fallback.

### 9.2 Potential inputs
Queue entry timestamps/status transitions, party size, available/occupied/cleaning table state and capacity, recent seating/table-turnover durations, time/day, restaurant pause/capacity state, and historical observations for similar conditions. Weather, local events, and ML are later options.

### 9.3 Measurement
Track:
- Mean absolute error (MAE) between predicted and observed wait.
- Prediction interval coverage: how often actual waits fall within the displayed range.
- Error by party size, restaurant, daypart, and volume where sample sizes permit.
- Frequency and size of ETA changes.
- Cancellations/no-shows associated with long waits.

Do not train a model until data is sufficiently clean and representative. Later, evaluate random forest or XGBoost against the baseline before production use.

## 10. Technology stack

### 10.1 Selected baseline
| Layer | Technology | Responsibility |
|---|---|---|
| Customer mobile | React Native + Expo + TypeScript | iOS/Android app |
| Mobile navigation | Expo Router | File-based routes and deep links |
| Server state | TanStack Query | API cache, fetching, retries, invalidation |
| Local/UI state | Zustand | Client-side state that does not belong on server |
| Forms/validation | React Hook Form + Zod | Typed forms and validation |
| API | Node.js + TypeScript + Fastify | Business rules and REST API |
| API contracts | Zod schemas + OpenAPI | Validation and API documentation |
| Database | Managed PostgreSQL | Authoritative product data |
| ORM/migrations | Prisma | Schema, migrations, typed data access |
| Realtime | Socket.IO | Live queue/table/ETA updates |
| Authentication | Clerk | Customer and staff authentication |
| Staff web app | Next.js + TypeScript | Restaurant dashboard |
| Notifications | Expo Notifications / Expo Push Service | Push notifications |
| Cache/jobs | Redis + BullMQ, when needed | Background jobs, retries, caching |
| Analytics | PostHog | Product events and funnel analysis |
| Error monitoring | Sentry | Mobile/web/API error visibility |
| Testing | Vitest, Playwright, Maestro | Unit/integration, web E2E, mobile E2E |
| Monorepo | pnpm + Turborepo | Workspace and task orchestration |
| CI/CD | GitHub Actions + EAS Build | Automated checks and mobile builds |
| File storage | S3-compatible object storage | Restaurant images and future media |
| Maps | Google Maps Platform or Mapbox | Travel-time features after evaluation |

Package names and exact versions must be selected against current Expo SDK/provider documentation at implementation time. Do not pin versions from an old research report.

### 10.2 Infrastructure
Start with managed PostgreSQL and one deployed Fastify API. Deploy the Next.js dashboard separately. Keep Socket.IO in the API deployment while the app is small. Add Redis and a Socket.IO Redis adapter when multiple API instances or cross-instance broadcasting are needed. Add BullMQ for retryable background work when notification volume and reliability requirements justify it.

Potential candidates include Neon or Supabase for managed PostgreSQL and Railway, Render, or Fly.io for the API. These are candidates, not finalized vendors. Evaluate region latency, backups, connection pooling/limits, deployment ergonomics, price, and support.

### 10.3 Why a custom API
QueueBite has concurrent queue operations, table-assignment constraints, realtime events, notification workflows, and restaurant-specific authorization. A custom TypeScript API keeps these rules in one place while managed services reduce infrastructure work. A Supabase-first MVP remains a viable alternative if speed outweighs backend control, but do not split authoritative queue logic across competing sources of truth.

### 10.4 Proposed monorepo
```text
queuebite/
  apps/
    mobile/       # Expo React Native customer app
    admin/        # Next.js restaurant dashboard
    api/          # Fastify REST API + Socket.IO
  packages/
    contracts/    # Shared Zod schemas, API and event types
    database/     # Prisma schema, migrations, seed scripts
    config/       # Shared TypeScript, lint and formatting config
  docs/
    product-spec.md
    api.md
    architecture.md
  pnpm-workspace.yaml
  turbo.json
  package.json
  README.md
```

### 10.5 Architectural principles
- PostgreSQL owns durable, authoritative state.
- Validate inputs at the API boundary.
- Put business rules in backend services, not UI components.
- Share contracts and event types across clients and API.
- Keep secrets out of source control and the mobile bundle.
- Use least-privilege access and restaurant-scoped authorization.
- Keep realtime events small and versioned.
- Start with a modular monolith, not microservices.
- Extract a separate prediction service only when a real model/workload justifies it.

## 11. Initial conceptual data model

Exact Prisma schema and field types will be finalized during implementation. These are core entities, not a claim every field is settled.

### User profile
Internal ID, unique Clerk user ID, display name and optional contact details, preferences, timestamps, and account state/deletion metadata where required. Avoid copying unnecessary identity data from Clerk; define which system owns each field.

### Restaurant
ID, name, slug/public identifier, description, cuisine/categories, images, address/geospatial reference, service hours, current online queue state, supported party-size range, queue configuration, timestamps.

### Restaurant membership
User/profile reference, restaurant reference, role, membership status, timestamps, and optional invitation/audit metadata. Enforce that staff only operate on restaurants where they have active permission.

### Table
ID, restaurant ID, label/number, seating capacity, operational status, optional section/floorplan metadata later, timestamps.

### Queue entry
ID, restaurant ID, optional customer ID, party size, minimal display/contact details, source (online, staff walk-in, supported integration), status, join/update timestamps, arrival/notification/seating/completion/cancellation/no-show timestamps as applicable, assigned table reference, optional group-session reference, idempotency/request metadata, and version/update timestamp for concurrency.

### Queue event / audit log
ID and restaurant/queue-entry references, event type, actor identity/role, timestamp, minimal structured change metadata, correlation/request ID where useful. Never store secrets or unnecessary message contents.

### Wait history / prediction observation
Restaurant and queue context, prediction timestamp/range, actual observed wait once available, baseline/model version, evaluation features, and data-quality flags.

### Later-phase entities
- **Menu:** categories, items, availability, prices, modifiers, preparation duration.
- **Order/order items:** linked to queue entry/group, status, prep status, timestamps, staff overrides.
- **Group sessions:** organizer, restaurant/candidates, expiry/status, participants/RSVP, shared cart linkage, finalized party size, safe invite-link metadata.
- **Notification outbox/delivery attempts:** durable notification work and outcomes.
- **Operating-hours exceptions and queue configuration.**

## 12. API and realtime contract principles

The exact route names and payload schemas are implementation artifacts. API capabilities should include restaurant discovery/detail, queue configuration/open state, customer join/read/cancel, staff queue listing and walk-in creation, seat/table assignment, table status update, pause/resume online admission, analytics, and later menu/orders/group sessions/Smart Table Finder.

### API conventions
- Version API where appropriate.
- Validate request and response shapes with shared Zod contracts.
- Use consistent error envelopes and meaningful HTTP status codes.
- Paginate growing lists and analytics queries.
- Use idempotency keys for mutation endpoints where retry duplication matters.
- Do not expose private customer contact data in public discovery.
- Rate-limit queue join and public-link flows.

### Candidate Socket.IO events
- Queue entry created/updated/cancelled.
- Party approaching turn / ready.
- Table status changed.
- Queue admission paused/resumed.
- ETA recalculated.
- Order status changed (later).

Events must be scoped to authorized restaurant rooms or user channels. The server validates room membership; clients cannot subscribe to arbitrary restaurant channels. Include event IDs/versioning where useful. Clients refetch canonical state after reconnect or detecting a gap.

### Mutation ordering
1. Authenticate and authorize.
2. Validate input and current state.
3. Execute database mutation in a transaction.
4. Persist audit/event/outbox record in the same transaction where needed.
5. Commit.
6. Publish realtime update and process notifications from committed state.
7. Retry asynchronous delivery safely.

## 13. Security, privacy, and compliance

- Use HTTPS in all deployed environments.
- Keep server secrets out of source control and client bundles.
- Verify Clerk tokens and enforce authorization on every protected API action.
- Apply restaurant-scoped role checks.
- Rate-limit and protect public entry points from abuse.
- Minimize personal data and collect only what queue operations require.
- Define retention/deletion policies for queue history, contact details, analytics, and audit logs.
- Restrict customer contact data to staff who need it.
- Never log access tokens, OTPs, secrets, or unnecessary personal data.
- Protect group invite links against guessing and unauthorized access.
- Treat dietary/allergy information as sensitive operational information.
- Clearly communicate that wait estimates are predictions, not guarantees.
- Define consent and opt-out behavior for SMS/push/marketing.
- Review applicable Indian privacy, consumer, telecom/SMS, and payment rules before launch, with qualified advice where needed.
- Configure backups and test restoration.
- Document incident response and staff access revocation.

## 14. Observability, analytics, and metrics

### Operational monitoring
Monitor API error rate/latency, database connection saturation and slow queries, Socket.IO reconnect health, queue mutation conflicts, notification failures, job retries/failures when workers exist, and mobile/web crashes.

### Product events
Potential events: restaurant list/detail viewed, queue join started/succeeded/failed, queue cancelled, ready notification sent/opened where observable, party seated, and later pre-order/group actions. Avoid sending phone numbers, names, allergy details, raw location histories, or unnecessary personal data to analytics.

### KPIs
- Queue join conversion.
- Median and percentile wait.
- ETA MAE and interval coverage.
- No-show rate.
- Customer cancellation rate.
- Walk-away rate where measurable.
- Parties served per shift.
- Table turnover time where reliable.
- Notification delivery success.
- Staff adoption/completeness of walk-in/table updates.
- Repeat usage and restaurant retention.

Set numerical targets after pilot baselines are collected; do not invent targets without evidence.

## 15. Testing strategy

### Unit tests
Queue state transitions, party/table compatibility, ETA calculation/range formatting, permission checks, idempotency, and notification trigger rules.

### Integration tests
Database transactions and conflicts, duplicate join requests, concurrent table assignment, queue pause/resume, outbox retry/duplicate suppression, Clerk token verification, and role enforcement.

### End-to-end tests
Customer joins/tracks a queue; staff adds a walk-in and seats a party; ETA updates reach customer and staff; customer cancels eligible entry; staff cannot access another restaurant's data; app reconnects and recovers authoritative state.

Use Vitest for unit/integration tests, Playwright for dashboard E2E, and Maestro for mobile flows. Add load tests for queue mutations and realtime fan-out before wider rollout.

## 16. Deployment and environments

Maintain separate development, staging, and production environments.
- Use distinct databases and Clerk configuration/keys per environment.
- Keep secrets in environment/secret management.
- Run migrations through a controlled deployment step.
- Configure backups and database connection pooling.
- Add API health/readiness endpoints.
- Run CI checks for lint, type-check, tests, and build.
- Use EAS Build for mobile development/release builds.
- Ensure staging notifications/SMS cannot accidentally contact production users.
- Document rollback for API/schema changes.
- Test backup restoration and recovery before launch.

Vendor selection remains open; choose based on operational fit and current pricing, not brand familiarity alone.

## 17. Delivery roadmap

### Phase 0: foundation
- Confirm requirements and unresolved policies.
- Set up pnpm/Turborepo monorepo.
- Create Expo app, Next.js dashboard, and Fastify API.
- Set up shared TypeScript and Zod contracts.
- Provision PostgreSQL and Prisma migrations.
- Integrate Clerk across mobile/web and verify API tokens.
- Establish CI, environment configuration, logging, and error monitoring.

### Phase 1: operational MVP
- Restaurant profile and basic discovery.
- Staff membership and restaurant-scoped roles.
- Table inventory and table statuses.
- Customer queue join/status/cancel.
- Staff walk-in creation and unified queue.
- Staff seating/table assignment and lifecycle actions.
- Baseline wait range.
- Socket.IO queue/table updates.
- Push notifications for confirmation/near-turn/ready as appropriate.
- Basic operational analytics.
- Pilot with a small number of restaurants and validate staff data-entry discipline.

### Phase 2: reliability and differentiation
- Improve ETA calibration using pilot history.
- SMS fallback if needed by customer behavior/economics.
- Smart Table Finder using route time plus wait range.
- Group session design/implementation.
- Queue-aware menu and pre-order workflow.
- Redis/BullMQ when async job volume and retry requirements justify them.
- Enhanced reporting and restaurant onboarding.

### Phase 3: growth
- Multi-location restaurant support.
- Reservation/POS integrations after partner/data contracts are clear.
- Advanced prediction models after baseline evaluation.
- Loyalty/off-peak offers.
- WhatsApp Business integration if supported and economically justified.
- Voice/hardware integrations only if user evidence supports them.

## 18. Product risks and mitigations

| Risk | Why it matters | Mitigation |
|---|---|---|
| Inaccurate wait estimates | Erodes trust and causes walk-aways | Start with ranges, collect actual outcomes, measure error |
| Staff omit walk-ins/table changes | Queue model diverges from reality | Make dashboard fast, train staff, monitor update completeness |
| Conflicting seating actions | Double-assignment and disruption | Transactional mutations, constraints, conflict handling |
| Push/SMS not delivered | Guests miss their turn | Track attempts, retry safely, provide in-app status/fallback |
| Low restaurant coverage | Discovery has little value | Start in a concentrated pilot area |
| Premature ML | Complexity without reliable data | Statistical baseline first |
| Too many integrations | Slows MVP and adds failure points | Defer POS, payments, WhatsApp, hardware |
| Auth/tenant authorization gaps | Cross-restaurant data exposure | Clerk token verification plus backend membership checks |
| Privacy overcollection | Increased risk and compliance burden | Data minimization, retention policy, restricted access |
| Vendor cost surprises | Can break unit economics | Track maps, SMS, hosting, database, and auth usage |

## 19. Decisions still required

1. Initial launch geography and pilot restaurant segment.
2. Customer sign-in methods and whether phone verification is mandatory.
3. Whether anonymous browsing is allowed.
4. Contact details required for queue join.
5. Queue ordering policy: strict FIFO vs staff-prioritized exceptions.
6. No-show timeout, late-arrival grace period, and cancellation policy.
7. Whether a party can hold multiple active queue entries.
8. Table combination and accessibility requirements.
9. Whether public QR/PWA join is in MVP.
10. SMS provider and consent/opt-out rules.
11. Hosting provider, database provider, deployment region, and budget.
12. Maps provider and location-permission behavior.
13. Restaurant pricing/business model and pilot success criteria.
14. Whether pre-orders require payment in the first pre-order release.
15. Data retention, deletion, and customer support policies.
16. Minimum analytics and prediction-quality thresholds for pilot expansion.

## 20. Definition of MVP readiness

Do not call the MVP ready solely because screens work. At minimum:
- Customers can join/view a queue without duplicate entries from ordinary retries.
- Staff can add walk-ins, seat parties, and update tables safely.
- Conflicting table assignments are rejected cleanly.
- Customer/staff views converge after realtime disconnect/reconnect.
- Queue changes and notification jobs are not triggered from uncommitted state.
- Restaurant-scoped permissions are tested.
- ETA range behavior is understandable and measured against actual waits.
- Basic monitoring, backups, and deployment rollback are in place.
- Staff understand that walk-ins and table changes must be recorded.
- A pilot runbook and feedback process exist.

## 21. Guiding principles

1. **Trust before cleverness:** reliable queue operations beat flashy AI.
2. **PostgreSQL is authoritative:** caches and realtime messages never replace durable state.
3. **Server-side rules:** clients request actions; the API decides whether they are allowed.
4. **Ranges over false precision:** estimates communicate uncertainty.
5. **Modular monolith first:** introduce separate services only when justified.
6. **Instrument from day one:** collect the minimum data needed to improve service.
7. **Pilot before scaling:** validate real restaurant workflows before complex integrations.

---

**Status note:** This is a detailed working specification, not a substitute for final decisions on policies, vendors, pricing, legal review, or exact database/API schemas. Resolve those explicitly as implementation proceeds.
