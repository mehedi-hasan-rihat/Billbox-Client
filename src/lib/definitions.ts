// ---------------------------------------------------------------------------
// Form State (shared across all server actions)
// ---------------------------------------------------------------------------

export type AuthFormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
        name?: string[];
        form?: string[];
      };
      message?: string;
    }
  | undefined;

/** Generic form state for non-auth forms (bills, contacts, recurring). */
export type FormState = {
  errors?: Record<string, string[]>;
  message?: string;
} | undefined;

// ---------------------------------------------------------------------------
// Enums / Unions
// ---------------------------------------------------------------------------

export type BillCategory =
  | "INTERNET"
  | "ELECTRICITY"
  | "GAS"
  | "WATER"
  | "MOBILE"
  | "RESTAURANT"
  | "SHOPPING"
  | "SUBSCRIPTION"
  | "RENT"
  | "EDUCATION"
  | "OTHER";

export type PaymentMethod = "CASH" | "BKASH" | "NAGAD" | "BANK" | "CARD" | "OTHER";

/** Persisted + computed statuses returned by the API. */
export type BillStatus =
  | "INBOX"
  | "UNPAID"
  | "PARTIALLY_PAID"
  | "PAID"
  | "UPCOMING"
  | "DUE_TODAY"
  | "OVERDUE";

/** Same values, used as query params in GET /bills. */
export type BillStatusFilter = BillStatus;

export type BillSource = "MANUAL" | "INBOX";

export type BillType = "ONE_TIME" | "RECURRING";

export type BillDirection = "OUTGOING" | "INCOMING";

export type RecurringStatus = "ACTIVE" | "PAUSED" | "STOPPED";

export type RecurringFrequency = "MONTHLY" | "WEEKLY" | "YEARLY";

export type BillEventType =
  | "CREATED"
  | "SENT"
  | "RECEIVED"
  | "CONFIRMED"
  | "PAYMENT_ADDED"
  | "FULLY_PAID"
  | "PAYMENT_UPDATED"
  | "PAYMENT_DELETED"
  | "EDITED"
  | "NOTE_ADDED"
  | "NOTE_UPDATED"
  | "NOTE_DELETED"
  | "RECURRING_GENERATED";

// ---------------------------------------------------------------------------
// Domain Models
// ---------------------------------------------------------------------------

export interface Contact {
  id: string;
  userId: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  billBoxId: string | null;
  createdAt: string;
  updatedAt: string;
}

/** A single payment record on a bill. */
export interface Payment {
  id: string;
  billId: string;
  amount: string;
  paidOn: string;
  paymentMethod: PaymentMethod | null;
  paymentReference: string | null;
  note: string | null;
  createdAt: string;
}

export interface Bill {
  id: string;
  userId: string;
  source: BillSource;
  type: BillType;
  direction: BillDirection;
  name: string;
  category: BillCategory;
  amount: string;
  issueDate: string | null;
  dueDate: string | null;
  notes: string[];
  contactId: string | null;
  contact: Contact | null;
  recurringRuleId: string | null;
  status: BillStatus;
  totalPaid: string;
  remaining: string;
  payments: Payment[];
  createdAt: string;
  updatedAt: string;
}

export interface ContactLookupResult {
  id: string;
  billBoxId: string;
  name: string;
  email: string;
}

export interface RecurringRule {
  id: string;
  userId: string;
  name: string;
  category: BillCategory;
  amount: string;
  note: string | null;
  contactId: string | null;
  contact?: Contact | null;
  frequency: RecurringFrequency;
  dayRule: string;
  generateDaysBefore: number;
  status: RecurringStatus;
  startAt: string | null;
  nextGenerateAt: string | null;
  endsAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Timeline
// ---------------------------------------------------------------------------

export interface TimelineActor {
  id: string;
  email: string;
  name: string;
  billBoxId: string;
}

export interface BillTimelineEvent {
  id: string;
  billId: string;
  type: BillEventType;
  actor: TimelineActor;
  metadata: Record<string, unknown>;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ---------------------------------------------------------------------------
// Query Params
// ---------------------------------------------------------------------------

export type BillSortField = "issueDate" | "dueDate" | "amount" | "createdAt";

export interface BillListParams {
  search?: string;
  category?: BillCategory;
  source?: BillSource;
  type?: BillType;
  direction?: BillDirection;
  status?: BillStatusFilter;
  issueDateFrom?: string;
  issueDateTo?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  sort?: BillSortField;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// ---------------------------------------------------------------------------
// Auth Request Bodies
// ---------------------------------------------------------------------------

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  billBoxId: string;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}

export interface RegisterBody {
  email: string;
  password: string;
  name?: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

// ---------------------------------------------------------------------------
// Bill Request Bodies
// ---------------------------------------------------------------------------

export interface CreateBillBody {
  name: string;
  category: BillCategory;
  amount: string;
  issueDate?: string;
  dueDate?: string;
  note?: string;
  contactId?: string;
  direction?: BillDirection;
}

export interface EditBillBody {
  name?: string;
  category?: BillCategory;
  amount?: string;
  issueDate?: string;
  dueDate?: string;
  contactId?: string | null;
  direction?: BillDirection;
}

export interface AddPaymentBody {
  amount: string;
  paidOn: string;
  paymentMethod?: PaymentMethod;
  paymentReference?: string;
  note?: string;
}

export interface UpdatePaymentBody {
  amount?: string;
  paidOn?: string;
  paymentMethod?: PaymentMethod;
  paymentReference?: string;
  note?: string;
}

// ---------------------------------------------------------------------------
// Contact Request Bodies
// ---------------------------------------------------------------------------

export interface CreateContactBody {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  billBoxId?: string;
}

export interface EditContactBody {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  billBoxId?: string;
}

// ---------------------------------------------------------------------------
// Recurring Request Bodies
// ---------------------------------------------------------------------------

export interface CreateRecurringBody {
  name: string;
  category: BillCategory;
  amount: string;
  note?: string;
  contactId?: string;
  frequency: RecurringFrequency;
  dayRule: string;
  generateDaysBefore?: number;
  startAt?: string;
  endsAt?: string;
}

export interface EditRecurringBody {
  name?: string;
  category?: BillCategory;
  amount?: string;
  note?: string;
  contactId?: string | null;
  dayRule?: string;
  generateDaysBefore?: number;
  endsAt?: string | null;
}
