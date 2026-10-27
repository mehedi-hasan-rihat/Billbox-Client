# Bills API

Base path: `/api/v1/bills`

All endpoints require authentication: `Authorization: Bearer <token>`

---

## Bill Status

The `status` field in every API response represents the **effective current state** of the bill.
Four values are persisted in the database. Three are computed at query time and never stored.

| Status | Persisted in DB | Set by | Meaning |
|--------|----------------|--------|---------|
| `INBOX` | ✅ | System | Arrived via BillBox ID, not yet confirmed by recipient |
| `UNPAID` | ✅ | System | Confirmed/created, no payments recorded |
| `PARTIALLY_PAID` | ✅ | System | At least one payment recorded but total < bill amount |
| `PAID` | ✅ | System | Total payments >= bill amount |
| `UPCOMING` | ❌ computed | System | `UNPAID` + due date is in the future |
| `DUE_TODAY` | ❌ computed | System | `UNPAID` + due date is today |
| `OVERDUE` | ❌ computed | System | `UNPAID` + due date has passed |

### How it works

Payment status (`UNPAID` / `PARTIALLY_PAID` / `PAID`) is re-derived automatically whenever a payment is added, updated, or deleted — it reflects the sum of all payments vs the bill amount. On every read, the system also computes the effective status from `status + dueDate` and overwrites `status` in the response.

```
DB stores:   UNPAID  (dueDate: 2026-10-08)  →  API returns: UPCOMING
DB stores:   UNPAID  (dueDate: 2026-10-05)  →  API returns: DUE_TODAY
DB stores:   UNPAID  (dueDate: 2026-10-03)  →  API returns: OVERDUE
DB stores:   UNPAID  (no dueDate)           →  API returns: UNPAID
DB stores:   PARTIALLY_PAID                 →  API returns: PARTIALLY_PAID (always, regardless of dueDate)
DB stores:   PAID                           →  API returns: PAID
```

`PARTIALLY_PAID` is always returned as-is. The `dueDate` field can be used to show an overdue indicator in the UI if needed.

### Why not store UPCOMING / OVERDUE in the DB?

Storing them requires a background job to update bills as time passes. If that job fails or is delayed, statuses become stale. Computing at read time is always correct, zero maintenance, no infrastructure needed.

---

## Bill Source

How the bill entered BillBox. Always one of:

| Source | Meaning |
|--------|---------|
| `MANUAL` | Created by the user themselves (including recurring-generated bills) |
| `INBOX` | Arrived via BillBox ID from another user |

---

## Bill Type

What kind of bill it is:

| Type | Meaning |
|------|---------|
| `ONE_TIME` | A regular single bill |
| `RECURRING` | Auto-generated from a recurring rule |

A recurring-generated bill has `source = MANUAL` and `type = RECURRING`. Use `type` to distinguish recurring bills from one-time bills.

---

## Categories

`INTERNET` `ELECTRICITY` `GAS` `WATER` `MOBILE` `RESTAURANT` `SHOPPING` `SUBSCRIPTION` `RENT` `EDUCATION` `OTHER`

---

## Payment Methods

`CASH` `BKASH` `NAGAD` `BANK` `CARD` `OTHER`

---

## Endpoints

### POST /bills

Create a bill manually.

**Request Body**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | string | Yes | Bill title |
| category | BillCategory | Yes | See categories above |
| amount | string (decimal) | Yes | e.g. `"1200.00"` |
| issueDate | ISO date string | No | Date printed on the bill |
| dueDate | ISO date string | No | Payment deadline |
| note | string | No | Free text note |
| senderBillerId | string | No | ID of a biller from your biller list |

**Example Request**

```bash
curl -X POST http://localhost:3000/api/v1/bills \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "October Internet Bill",
    "category": "INTERNET",
    "amount": "1200.00",
    "dueDate": "2026-10-10"
  }'
```

**Example Response (201)**

```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "userId": "clx...",
    "source": "MANUAL",
    "type": "ONE_TIME",
    "name": "October Internet Bill",
    "category": "INTERNET",
    "amount": "1200.00",
    "issueDate": null,
    "dueDate": "2026-10-10T00:00:00.000Z",
    "note": null,
    "senderBillerId": null,
    "senderBiller": null,
    "recurringRuleId": null,
    "status": "UPCOMING",
    "totalPaid": "0.00",
    "remaining": "1200.00",
    "payments": [],
    "createdAt": "2026-10-05T08:00:00.000Z",
    "updatedAt": "2026-10-05T08:00:00.000Z"
  },
  "timestamp": "2026-10-05T08:00:00.000Z"
}
```

**Errors**

| Status | Message |
|--------|---------|
| 400 | Validation errors |
| 404 | Biller not found (if `senderBillerId` is invalid) |

---

### GET /bills

List the authenticated user's bills with optional search, filtering, sorting, and pagination. All parameters are optional and composable.

**Query Parameters**

| Param | Type | Default | Notes |
|-------|------|---------|-------|
| search | string | — | Case-insensitive search across bill name and biller name |
| category | BillCategory | — | Filter by category |
| source | `MANUAL` \| `INBOX` | — | Filter by how the bill entered BillBox |
| type | `ONE_TIME` \| `RECURRING` | — | Filter by bill type |
| status | BillStatusFilter | — | `INBOX` `UNPAID` `PARTIALLY_PAID` `UPCOMING` `DUE_TODAY` `OVERDUE` `PAID` |
| issueDateFrom | ISO date | — | Issue date range start |
| issueDateTo | ISO date | — | Issue date range end |
| dueDateFrom | ISO date | — | Due date range start |
| dueDateTo | ISO date | — | Due date range end |
| sort | string | `createdAt` | `issueDate` `dueDate` `amount` `createdAt` |
| order | string | `desc` | `asc` \| `desc` |
| page | number | `1` | Min: 1 |
| limit | number | `20` | Min: 1, Max: 100 |

**Status filter behaviour**

| Filter | DB condition |
|--------|-------------|
| `UPCOMING` | `status = UNPAID AND dueDate > today` |
| `DUE_TODAY` | `status = UNPAID AND dueDate = today` |
| `OVERDUE` | `status = UNPAID AND dueDate < today` |
| `UNPAID` | `status = UNPAID AND dueDate IS NULL` |
| `PARTIALLY_PAID` | `status = PARTIALLY_PAID` |
| `INBOX`, `PAID` | `status = <value>` |

**Example Requests**

```bash
# All overdue bills
GET /api/v1/bills?status=OVERDUE

# All partially paid bills
GET /api/v1/bills?status=PARTIALLY_PAID

# Internet bills due this month, sorted by due date
GET /api/v1/bills?category=INTERNET&dueDateFrom=2026-10-01&dueDateTo=2026-10-31&sort=dueDate&order=asc

# Search by name, page 2
GET /api/v1/bills?search=internet&page=2&limit=10
```

**Example Response (200)**

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "clx...",
        "source": "MANUAL",
        "type": "ONE_TIME",
        "name": "October Internet Bill",
        "status": "UPCOMING",
        "category": "INTERNET",
        "amount": "1200.00",
        "dueDate": "2026-10-10T00:00:00.000Z",
        "totalPaid": "0.00",
        "remaining": "1200.00",
        "recurringRuleId": null,
        "payments": []
      }
    ],
    "meta": {
      "total": 42,
      "page": 1,
      "limit": 20,
      "totalPages": 3
    }
  },
  "timestamp": "2026-10-05T08:00:00.000Z"
}
```

**Errors**

| Status | Message |
|--------|---------|
| 400 | Validation errors (invalid category, status, sort field, etc.) |

---

### GET /bills/:id

Get a single bill by ID.

**Errors**

| Status | Message |
|--------|---------|
| 404 | Bill not found |

---

### PATCH /bills/:id

Edit bill details. Status transitions are not allowed here — use the payments endpoints.

**Request Body** (all fields optional)

| Field | Type | Notes |
|-------|------|-------|
| name | string | |
| category | BillCategory | |
| amount | string (decimal) | |
| issueDate | ISO date string | Date printed on the bill |
| dueDate | ISO date string | |
| senderBillerId | string \| null | Set to `null` to remove |

**Errors**

| Status | Message |
|--------|---------|
| 404 | Bill not found |
| 404 | Biller not found |

---

### GET /bills/:id/timeline

Get the full event history for a bill in chronological order.

**Example Response (200)**

```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "billId": "clx...",
      "type": "CREATED",
      "actor": {
        "id": "clx...",
        "email": "mehedi@example.com",
        "name": "Mehedi",
        "billBoxId": "BB-A1B2-C3D4-E5F6"
      },
      "metadata": { "source": "MANUAL" },
      "createdAt": "2026-10-05T08:00:00.000Z"
    },
    {
      "type": "PAYMENT_ADDED",
      "metadata": { "paymentId": "clx...", "amount": "600.00", "paidOn": "2026-10-08", "method": "BKASH" }
    },
    {
      "type": "FULLY_PAID",
      "metadata": { "totalPaid": "1200.00" }
    }
  ],
  "timestamp": "2026-10-05T08:00:00.000Z"
}
```

**Event types:**
`CREATED` `SENT` `RECEIVED` `CONFIRMED` `PAYMENT_ADDED` `FULLY_PAID` `PAYMENT_UPDATED` `PAYMENT_DELETED` `EDITED` `NOTE_ADDED` `RECURRING_GENERATED`

---

### PATCH /bills/:id/notes

Add or update the note on a bill. Send `null` to clear it.

**Request Body**

| Field | Type | Notes |
|-------|------|-------|
| note | string \| null | Pass `null` to remove the note |

---

## Payment Endpoints

Bills support partial and multiple payments. Each payment is an independent record. The bill's `status` is automatically re-derived after every payment change:

- No payments → `UNPAID`
- Total payments < bill amount → `PARTIALLY_PAID`
- Total payments >= bill amount → `PAID`

The bill response always includes `totalPaid`, `remaining`, and `payments[]`.

---

### POST /bills/:id/payments

Add a payment to a bill. Bill status is recomputed automatically.

**Request Body**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| amount | string (decimal) | Yes | Must be > 0 |
| paidOn | ISO date string | Yes | When this payment was made |
| paymentMethod | PaymentMethod | No | |
| paymentReference | string | No | Transaction ID / receipt number |
| note | string | No | Per-payment note |

**Example Request**

```bash
curl -X POST http://localhost:3000/api/v1/bills/clx.../payments \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": "600.00",
    "paidOn": "2026-10-08",
    "paymentMethod": "BKASH",
    "paymentReference": "TXN8FK2910"
  }'
```

**Errors**

| Status | Message |
|--------|---------|
| 400 | Confirm the bill before recording payments (INBOX bill) |
| 400 | Payment amount must be greater than 0 |
| 404 | Bill not found |

---

### GET /bills/:id/payments

List all payments for a bill, ordered by `paidOn` ascending.

**Example Response (200)**

```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "billId": "clx...",
      "amount": "600.00",
      "paidOn": "2026-10-08T00:00:00.000Z",
      "paymentMethod": "BKASH",
      "paymentReference": "TXN8FK2910",
      "note": null,
      "createdAt": "2026-10-08T10:00:00.000Z"
    }
  ],
  "timestamp": "2026-10-08T10:00:00.000Z"
}
```

**Errors**

| Status | Message |
|--------|---------|
| 404 | Bill not found |

---

### PATCH /bills/:id/payments/:paymentId

Update a specific payment. All fields optional. Bill status is recomputed after the update.

**Request Body**

| Field | Type |
|-------|------|
| amount | string (decimal) |
| paidOn | ISO date string |
| paymentMethod | PaymentMethod |
| paymentReference | string |
| note | string |

**Errors**

| Status | Message |
|--------|---------|
| 404 | Bill not found |
| 404 | Payment not found |

---

### DELETE /bills/:id/payments/:paymentId

Delete a specific payment. Bill status is recomputed after deletion.

**Errors**

| Status | Message |
|--------|---------|
| 404 | Bill not found |
| 404 | Payment not found |

---

# Billers API

Base path: `/api/v1/billers`

All endpoints require authentication: `Authorization: Bearer <token>`

A **biller** is a sender or provider in your personal list — the entity that issues bills to you (e.g. Grameenphone, DESCO, your landlord, a restaurant). Billers are private per user.

---

## Endpoints

### GET /billers/lookup?billBoxId=

Look up a BillBox user by their BillBox ID before creating a biller.

**Query Parameters**

| Param | Type | Required |
|-------|------|----------|
| billBoxId | string | Yes |

**Example Response (200)**

```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "billBoxId": "BB-A1B2-C3D4-E5F6",
    "name": "Rakib",
    "email": "rakib@example.com"
  }
}
```

**Errors**

| Status | Message |
|--------|---------|
| 400 | `billBoxId` is required |
| 404 | No BillBox account found with ID "..." |

---

### POST /billers

Create a new biller.

**Request Body**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | string | Yes | Display name |
| phone | string | No | |
| email | string | No | Valid email |
| address | string | No | |
| billBoxId | string | No | If this biller is a BillBox user |

**Errors**

| Status | Message |
|--------|---------|
| 400 | No BillBox account found with ID "..." |
| 400 | Validation errors |

---

### GET /billers

List all billers belonging to the authenticated user, sorted by name.

---

### GET /billers/:id

Get a single biller by ID.

**Errors**

| Status | Message |
|--------|---------|
| 404 | Biller not found |

---

### PATCH /billers/:id

Update a biller. All fields optional.

**Errors**

| Status | Message |
|--------|---------|
| 400 | No BillBox account found with ID "..." |
| 404 | Biller not found |

---

### DELETE /billers/:id

Soft-delete a biller. Bills linked to this biller retain the `senderBillerId` reference.

**Errors**

| Status | Message |
|--------|---------|
| 404 | Biller not found |

---

# Recurring Bills API

Base path: `/api/v1/recurring`

All endpoints require authentication: `Authorization: Bearer <token>`

---

## How It Works

```
Create rule → scheduler runs daily at 01:00
  → finds rules where nextGenerateAt <= now AND status = ACTIVE
    → generates Bill (source = MANUAL, type = RECURRING, status = UNPAID)
    → advances nextGenerateAt to the next cycle
    → records RECURRING_GENERATED event on the bill
```

---

## Frequency & Day Rule

| Frequency | dayRule format | Example | Meaning |
|-----------|---------------|---------|---------|
| `MONTHLY` | `"1"`–`"28"` | `"10"` | Every month on the 10th |
| `WEEKLY` | `"0"`–`"6"` (0=Sun) | `"1"` | Every Monday |
| `YEARLY` | `"MM-DD"` | `"10-01"` | Every Oct 1st |

---

## Recurring Status

| Status | Meaning |
|--------|---------|
| `ACTIVE` | Scheduler generates bills normally |
| `PAUSED` | Scheduler skips this rule — no bills generated |
| `STOPPED` | Permanently stopped — cannot be reactivated |

---

## Endpoints

### POST /recurring

Create a new recurring rule.

**Request Body**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | string | Yes | Bill title template |
| category | BillCategory | Yes | |
| amount | string (decimal) | Yes | e.g. `"1200.00"` |
| note | string | No | |
| senderBillerId | string | No | Biller from your list |
| frequency | `MONTHLY` \| `WEEKLY` \| `YEARLY` | Yes | |
| dayRule | string | Yes | See frequency table above |
| generateDaysBefore | number | No | Days before due date to generate. Default: `5`. Min: `1`, Max: `30` |
| startAt | ISO date | No | First generation start. Defaults to now |
| endsAt | ISO date | No | When recurrence ends. Null = forever |

**Errors**

| Status | Message |
|--------|---------|
| 400 | Validation errors |
| 404 | Biller not found |

---

### GET /recurring

List all recurring rules for the authenticated user.

---

### GET /recurring/:id

Get a single recurring rule by ID.

**Errors**

| Status | Message |
|--------|---------|
| 404 | Recurring rule not found |

---

### PATCH /recurring/:id

Update a recurring rule. All fields optional. Changes take effect on the next generation cycle.

**Request Body**

| Field | Type | Notes |
|-------|------|-------|
| name | string | |
| category | BillCategory | |
| amount | string (decimal) | |
| note | string | |
| senderBillerId | string \| null | |
| dayRule | string | |
| generateDaysBefore | number | Min: `1`, Max: `30` |
| endsAt | ISO date \| null | |

---

### POST /recurring/:id/pause

Pause an `ACTIVE` rule.

**Errors**

| Status | Message |
|--------|---------|
| 400 | Rule is STOPPED, only ACTIVE rules can be paused |
| 404 | Recurring rule not found |

---

### POST /recurring/:id/resume

Resume a `PAUSED` rule.

**Errors**

| Status | Message |
|--------|---------|
| 400 | Rule is ACTIVE, only PAUSED rules can be resumed |
| 404 | Recurring rule not found |

---

### POST /recurring/:id/stop

Permanently stop a rule. Cannot be undone.

**Errors**

| Status | Message |
|--------|---------|
| 400 | Rule is already stopped |
| 404 | Recurring rule not found |

---

## Generated Bills

Bills generated by a recurring rule have `source = MANUAL`, `type = RECURRING`, and `recurringRuleId` set. They are fully independent — paying one does not affect others.
