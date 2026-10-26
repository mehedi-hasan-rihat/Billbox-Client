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

/** Generic form state for non-auth forms (bills, billers, recurring). */
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
  | "PAID"
  | "UPCOMING"
  | "DUE_TODAY"
  | "OVERDUE";

/** Same values, used as query params in GET /bills. */
export type BillStatusFilter = BillStatus;

export type BillSource = "MANUAL" | "INBOX";

export type BillType = "ONE_TIME" | "RECURRING";

export type RecurringStatus = "ACTIVE" | "PAUSED" | "STOPPED";

export type RecurringFrequency = "MONTHLY" | "WEEKLY" | "YEARLY";

export type BillEventType =
  | "CREATED"
  | "SENT"
  | "RECEIVED"
  | "CONFIRMED"
  | "PAID"
  | "EDITED"
  | "NOTE_ADDED"
  | "PAYMENT_UPDATED"
  | "RECURRING_GENERATED";

// ---------------------------------------------------------------------------
// Domain Models
// ---------------------------------------------------------------------------

export interface Biller {
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

export interface Bill {
  id: string;
  userId: string;
  source: BillSource;
  type: BillType;
  name: string;
  category: BillCategory;
  amount: string;
  billDate: string | null;
  dueDate: string | null;
  note: string | null;
  senderBillerId: string | null;
  senderBiller: Biller | null;
  recurringRuleId: string | null;
  status: BillStatus;
  paidAt: string | null;
  paidAmount: string | null;
  paymentMethod: PaymentMethod | null;
  paymentReference: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BillerLookupResult {
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
  senderBillerId: string | null;
  senderBiller?: Biller | null;
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

export interface BillListParams {
  search?: string;
  category?: BillCategory;
  source?: BillSource;
  type?: BillType;
  status?: BillStatusFilter;
  billDateFrom?: string;
  billDateTo?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  sort?: "billDate" | "dueDate" | "amount" | "createdAt";
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
  billDate?: string;
  dueDate?: string;
  note?: string;
  senderBillerId?: string;
  status?: "UNPAID" | "PAID";
  paidAt?: string;
  paidAmount?: string;
  paymentMethod?: PaymentMethod;
  paymentReference?: string;
}

export interface EditBillBody {
  name?: string;
  category?: BillCategory;
  amount?: string;
  billDate?: string;
  dueDate?: string;
  senderBillerId?: string | null;
}

export interface PayBillBody {
  paidAt: string;
  paidAmount?: string;
  paymentMethod?: PaymentMethod;
  paymentReference?: string;
}

export interface UpdatePaymentBody {
  paidAt?: string;
  paidAmount?: string;
  paymentMethod?: PaymentMethod;
  paymentReference?: string;
}

// ---------------------------------------------------------------------------
// Biller Request Bodies
// ---------------------------------------------------------------------------

export interface CreateBillerBody {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  billBoxId?: string;
}

export interface EditBillerBody {
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
  senderBillerId?: string;
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
  senderBillerId?: string | null;
  dayRule?: string;
  generateDaysBefore?: number;
  endsAt?: string | null;
}
