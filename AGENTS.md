<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

## BillBox Project Rules

### Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript 5** · **Tailwind CSS v4**
- **shadcn/ui** (`base-nova` style) + **@base-ui/react** primitives
- **lucide-react** for icons · **class-variance-authority** for variants · **cn** package for class merging

### Architecture

```
src/
├── app/
│   ├── (auth)/             # login, register — no shared layout needed
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/        # protected pages
│   │   └── dashboard/page.tsx
│   ├── actions/
│   │   └── auth.ts         # Server Actions — register, login, logout
│   ├── globals.css         # OKLCH tokens, @theme inline, base layer
│   ├── icon.tsx            # Favicon (ImageResponse)
│   ├── layout.tsx          # Root layout — Geist fonts, metadata
│   └── page.tsx            # Landing page (public)
├── components/
│   ├── auth/               # Auth-specific components
│   │   ├── auth-field.tsx          # Labelled input + error
│   │   ├── auth-form-error.tsx     # Form-level error banner
│   │   ├── auth-shell.tsx          # Centered card wrapper for auth pages
│   │   ├── auth-submit-button.tsx  # Submit with useFormStatus pending state
│   │   ├── login-form.tsx          # Client form using useActionState
│   │   ├── logout-button.tsx       # Form wrapping logoutAction
│   │   ├── profile-card.tsx        # User profile display (server)
│   │   └── register-form.tsx       # Client form using useActionState
│   ├── sections/           # Landing page sections
│   ├── ui/                 # shadcn primitives (button, card, badge, etc.)
│   ├── feature-card.tsx    # Icon + title + desc card
│   └── section-header.tsx  # Dot label + two-tone heading
├── lib/
│   ├── api.ts              # All API calls — never fetch directly in components
│   ├── definitions.ts      # Shared TS types (AuthFormState, etc.)
│   ├── session.ts          # Cookie read/write (server-only)
│   └── utils.ts            # re-exports cn()
└── middleware.ts            # Route protection (DEPRECATED in Next.js 16 — use proxy.ts)
```

### API Client Rules (`src/lib/api.ts`)

- **All API calls go through `src/lib/api.ts`** — never `fetch()` directly in components or pages
- Use `cache: "no-store"` for mutations (POST, PATCH, DELETE)
- Use `next: { tags: ["tag-name"] }` for GET requests that can be revalidated
- `ApiError` class carries `status` and `message` — always catch it in actions
- Base URL: `process.env.NEXT_PUBLIC_API_URL` + `/api/v1`

### Server Actions (`src/app/actions/`)

- All actions are `"use server"` files in `src/app/actions/`
- Always validate server-side even if the client also validates
- Return `AuthFormState` shape `{ errors?: { fieldName?: string[] } }` for form errors
- Use `redirect()` from `next/navigation` after successful mutations
- Never expose the raw JWT to client components — store in `HttpOnly` cookie via `src/lib/session.ts`

### Session (`src/lib/session.ts`)

- `createSession(token, user)` — writes `bb_token` and `bb_user` HttpOnly cookies
- `getSession()` — reads cookies, returns `Session | null`
- `deleteSession()` — clears both cookies (logout)
- Import with `import "server-only"` pattern — never call from client components

### Forms Pattern

All auth forms follow this pattern:

```tsx
// page.tsx (Server Component)
export default function Page() {
  return <AuthShell title="..." subtitle="..."><TheForm /></AuthShell>;
}

// the-form.tsx ("use client")
const [state, action] = useActionState(theAction, undefined);
return (
  <form action={action}>
    <AuthFormError errors={state?.errors?.form} />
    <AuthField ... errors={state?.errors?.fieldName} />
    <AuthSubmitButton label="..." />
  </form>
);
```

- `AuthField` — labelled input + per-field error
- `AuthFormError` — form-level error banner (network errors, 401, 409)
- `AuthSubmitButton` — uses `useFormStatus` for pending state, must be inside `<form>`
- `AuthShell` — centered card with brand header, used by login + register pages

### Proxy (`src/proxy.ts`) — replaces middleware in Next.js 16

- Unauthenticated → protected route: redirect to `/login?from=<path>`
- Authenticated → auth route (`/login`, `/register`): redirect to `/dashboard`
- Export `proxy` function (not `middleware`) from `src/proxy.ts`
- File must be at `src/proxy.ts` — Next.js 16 no longer recognises `middleware.ts`
- Checks `bb_token` cookie presence only (no JWT verification in proxy — keep it fast)
- `middleware.ts` is deprecated in Next.js 16 — always use `proxy.ts`

### Design System

Follow `docs/design.md` for all visual decisions:

- `rounded-sm` on all cards/panels (not `rounded-lg`)
- `font-mono` for labels, buttons, badges, IDs, step numbers
- `strokeWidth={1.5}` on all lucide icons
- Split button CTAs: filled left + muted right, shared border, `rounded-l-sm` / `rounded-r-sm`
- Two-tone headings: `text-foreground` main + `text-muted-foreground` highlight
- Dot + label section markers: `size-1.5 rounded-full bg-foreground/70` + mono text
- `font-light` on body copy

### Component Rules

- UI primitives → `src/components/ui/` (shadcn, `@base-ui/react`)
- Shared page-level → `src/components/` (SectionHeader, FeatureCard, etc.)
- Feature-grouped → `src/components/<feature>/` (e.g. `auth/`)
- Never use `src/components/ui/` components for layout — they are primitives only
- Always use `cn()` from the `cn` package for class merging

### Next.js 16 Specifics

- `cookies()` is **async** — always `await cookies()`
- `useActionState` (not `useFormState`) from `react`
- `useFormStatus` from `react-dom` — must be inside the `<form>` it targets
- Server Actions: `"use server"` directive at top of file or inline function
- `redirect()` throws — do not wrap in try/catch; call after all async work is done
- Route groups `(auth)`, `(dashboard)` — parentheses mean no URL segment
- Cache tags: `next: { tags: ["tag-name"] }` on fetch, `revalidateTag("tag-name")` to bust
- **`middleware.ts` is DEPRECATED** — use `src/proxy.ts` with exported `proxy` function instead

### Environment Variables

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | `http://localhost:3000` | BillBox backend base URL |

Copy `.env.example` to `.env.local` and set values before running.

### File Naming

- Pages: `app/(group)/route/page.tsx`
- Server Actions: `app/actions/<domain>.ts`
- Components: `PascalCase.tsx`
- Libs: `camelCase.ts`
- No `index.ts` barrel files — import directly from the file
