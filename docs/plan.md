# BillBox — Execution Plan

> Build the app one feature at a time. Each step depends on the previous one.

---

## Step 1 — Foundation: Types & API Client

**Files:**
- `src/lib/definitions.ts` — add shared TS types
- `src/lib/api.ts` — add API client functions

**Tasks:**
- Add types: `Bill`, `Biller`, `RecurringRule`, `BillTimelineEvent`, `PaginatedResponse<T>`
- Add enums/unions: `BillCategory`, `PaymentMethod`, `BillStatus`, `BillSource`, `BillType`, `RecurringStatus`, `RecurringFrequency`
- Add authenticated request helper (reads session, injects Bearer token)
- Add `billsApi`: create, list, get, edit, getTimeline, pay, updatePayment, updateNotes
- Add `billersApi`: lookup, create, list, get, edit, delete
- Add `recurringApi`: create, list, get, edit, pause, resume, stop

**Done when:** All API functions compile and can be imported anywhere.

---

## Step 2 — Dashboard: Real Data

**Files:**
- `src/app/(dashboard)/dashboard/page.tsx` — wire up real API calls
- `src/components/bills/bill-row.tsx` — reusable bill row component
- `src/components/bills/status-badge.tsx` — status badge component

**Tasks:**
- Call `billsApi.list()` with status filters to get real counts:
  - Total bills (`limit=1` for total count from meta)
  - Upcoming (`status=UPCOMING`)
  - Overdue (`status=OVERDUE`)
  - Paid this month (`status=PAID` + date range)
- Render recent bills in the inbox panel with status badges
- Replace disabled "ADD BILL" button with a working link to `/bills/new`
- Show empty state when no bills exist

**Done when:** Dashboard shows real data from the backend.

---

## Step 3 — Bills Feature

**Files:**
- `src/app/(dashboard)/bills/page.tsx` — bills list with search/filter/pagination
- `src/app/(dashboard)/bills/[id]/page.tsx` — bill detail with timeline
- `src/app/(dashboard)/bills/new/page.tsx` — create bill form
- `src/app/actions/bills.ts` — server actions
- `src/components/bills/bill-form.tsx` — create bill form (client)
- `src/components/bills/bills-filter-bar.tsx` — search + filter bar (client)
- `src/components/bills/bill-timeline.tsx` — event timeline
- `src/components/bills/add-payment-form.tsx` — add payment form (client)
- `src/components/bills/notes-editor.tsx` — notes edit (client)

**Tasks:**
- Bills list: search by name, filter by status/category/source/type, sort, pagination
- Bill detail: full info (amount, issueDate, dueDate, totalPaid, remaining, payments[]), status badge, timeline, add payment, notes
- Create bill: name, category, amount, issueDate, dueDate, biller — no payment fields on create
- **Payment model**: multiple payments per bill via `POST /bills/:id/payments`
  - Bill status auto-derived: UNPAID → PARTIALLY_PAID → PAID
  - `totalPaid` + `remaining` shown on detail page
  - Each payment has: amount, paidOn, paymentMethod, paymentReference, note
- Server actions: `createBillAction`, `addPaymentAction`, `updateNotesAction`
- New status: `PARTIALLY_PAID` — add to StatusBadge + filter bar
- Renamed field: `billDate` → `issueDate` (API), `issueDateFrom`/`issueDateTo` in list params
- Updated timeline events: `PAYMENT_ADDED`, `FULLY_PAID`, `PAYMENT_UPDATED`, `PAYMENT_DELETED`

**Done when:** User can create bills, add multiple payments, and track partial/full payment status.

---

## Step 4 — Billers Feature

**Files:**
- `src/app/(dashboard)/billers/page.tsx` — billers list
- `src/app/(dashboard)/billers/new/page.tsx` — create biller form
- `src/app/(dashboard)/billers/[id]/page.tsx` — biller detail (edit/delete)
- `src/app/actions/billers.ts` — server actions
- `src/components/billers/biller-form.tsx` — create/edit biller (client)
- `src/components/billers/biller-lookup.tsx` — BillBox ID lookup (client)
- `src/components/billers/biller-card.tsx` — biller display card

**Tasks:**
- Billers list: all billers sorted by name, with delete action
- Create biller: name + optional phone/email/address/billBoxId
- BillBox ID lookup: type a BillBox ID, show preview of the user before saving
- Edit biller: inline edit on detail page
- Server actions: `createBillerAction`, `editBillerAction`, `deleteBillerAction`
- Backfill: wire biller dropdown in bill create/edit form to live data

**Done when:** User can manage their full biller list with lookup.

---

## Step 5 — Recurring Feature

**Files:**
- `src/app/(dashboard)/recurring/page.tsx` — recurring rules list
- `src/app/(dashboard)/recurring/new/page.tsx` — create recurring rule form
- `src/app/actions/recurring.ts` — server actions
- `src/components/recurring/recurring-form.tsx` — create/edit recurring (client)
- `src/components/recurring/recurring-card.tsx` — recurring rule display
- `src/components/recurring/recurring-actions.tsx` — pause/resume/stop buttons (client)

**Tasks:**
- Recurring list: all rules with status badge (ACTIVE/PAUSED/STOPPED)
- Create recurring: name, category, amount, frequency, dayRule, generateDaysBefore, biller, endsAt
- Frequency-aware day rule input:
  - MONTHLY → day picker (1–28)
  - WEEKLY → weekday picker (Sun–Sat)
  - YEARLY → month + day picker
- Pause/resume/stop actions with confirmation
- Server actions: `createRecurringAction`, `editRecurringAction`, `pauseRecurringAction`, `resumeRecurringAction`, `stopRecurringAction`

**Done when:** User can create, manage, and control recurring bill rules.

---

## Notes

- Each step is self-contained — you can stop after any step and the app works
- Steps build on each other: Step 1 enables 2, Step 2 enables 3, etc.
- All new pages go under `src/app/(dashboard)/` (protected route group)
- All server actions go in `src/app/actions/<domain>.ts`
- All component files use PascalCase
- Follow `docs/design.md` for all visual decisions
