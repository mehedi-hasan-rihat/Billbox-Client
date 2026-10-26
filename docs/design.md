# BillBox Design System

Design system for **billbox-client**. Stack: Next.js 16, React 19, Tailwind CSS v4, `@base-ui/react` primitives, `class-variance-authority`, `lucide-react`.

---

## 1. Design Language

BillBox uses a **Mosa-inspired editorial style** — minimal, monospaced, high-contrast, light-only. No dark mode.

Core traits:
- **Monospace labels** everywhere — section markers, nav links, button text, badges, step numbers
- **Two-tone headings** — main title in `text-foreground`, continuation/highlight on a new line in `text-muted-foreground`
- **Dot + label section markers** — a `size-1.5 rounded-full bg-foreground/70` dot followed by monospace text introduces every section
- **`rounded-sm` not `rounded-lg`** — tight editorial corners throughout. Cards, buttons, panels all use `rounded-sm`
- **Circular icon containers** — icons sit in `size-10` or `size-12` `rounded-full border border-border` containers, not square boxes
- **`strokeWidth={1.5}`** on all lucide icons — lighter, more refined than the default `2`
- **`font-light`** on body copy — airy feel alongside the semibold monospace labels
- **Split button CTAs** — two connected `<a>` or `<button>` elements sharing a border. Left: filled (`bg-foreground text-background`). Right: muted (`bg-muted text-foreground border-l-0`)
- **Two-column bordered panels** — major content sections use a shared border box split into two equal-height columns (`grid lg:grid-cols-2`, left has `border`, right has `border border-l-0`)
- **`font-mono text-[11px] tracking-widest`** for button text — uppercase, spaced, compact

---

## 2. Color System

Colors live in `src/app/globals.css` as OKLCH CSS variables, mapped to Tailwind utilities via `@theme inline`. Light mode only — no `.dark` block.

### Semantic Token Pairs

| Token | Surface | Foreground | Used by |
|---|---|---|---|
| `background` / `foreground` | Page bg | Default text | Sections, page shell |
| `card` / `card-foreground` | Elevated surfaces | Card text | Mock panels, inbox rows |
| `muted` / `muted-foreground` | Subtle bg | De-emphasized text | Labels, hints, notes |
| `primary` / `primary-foreground` | High-emphasis | Text on primary | (reserved for future use) |
| `destructive` | Error/danger | — | OVERDUE badges |
| `border` | Borders | — | All borders, dividers |

### Usage Rules

```tsx
// ✅ Correct — semantic tokens only
<div className="bg-background text-foreground" />
<div className="bg-muted/30 text-muted-foreground" />
<div className="border border-border" />

// ❌ Avoid — never hardcode values in components
<div className="bg-[oklch(0.205_0_0)]" />
```

### Dark Emphasis Pattern

For the "resolution" row at the bottom of a section (e.g. the BillBox inbox row in the Problem section), invert by using `bg-foreground text-background`. This creates a bold visual anchor without a separate color token.

```tsx
<div className="bg-foreground text-background">
  <Receipt className="text-background" />
  <span className="text-background">One BillBox inbox</span>
</div>
```

---

## 3. Typography

### Fonts

| Variable | Font | Usage |
|---|---|---|
| `--font-sans` | Geist Sans | Body text, headings, UI |
| `--font-geist-mono` | Geist Mono | Labels, buttons, badges, step numbers, IDs |

### Scale in Practice

| Element | Classes |
|---|---|
| H1 (hero) | `text-[42px] font-normal leading-[1.05] tracking-[-0.02em]` → `lg:text-[64px]` |
| H2 (section) | `text-[28px] font-normal leading-[1.15] tracking-[-0.02em]` → `lg:text-[44px]` |
| H3 (card title) | `font-mono text-sm font-semibold tracking-tight` |
| Body / desc | `text-[15px] font-light leading-[1.6]` |
| Small body | `text-[13.5px] font-light leading-[1.6]` |
| Mono label | `font-mono text-xs tracking-[0.02em]` |
| Button text | `font-mono text-[11px] font-semibold tracking-widest` |
| Hint / arrow note | `font-mono text-[12px] text-muted-foreground/70` — used as `↳ hint text` |
| Step number | `font-mono text-xs font-semibold text-muted-foreground` — zero-padded e.g. `01` |

### Two-Tone Heading Pattern

All section headings split across two lines — first line bold, second line muted:

```tsx
<h2 className="text-[28px] font-normal leading-[1.15] tracking-[-0.02em] sm:text-[36px] lg:text-[44px]">
  Bills are scattered{" "}
  <br className="hidden sm:block" />
  <span className="text-muted-foreground">everywhere.</span>
</h2>
```

Use `SectionHeader` component for this automatically.

---

## 4. Spacing & Radius

### Radius

Everything uses `rounded-sm` (the smallest token). No `rounded-lg`, no `rounded-xl` on page-level components.

Exception: icon containers and step nodes use `rounded-full`.

### Spacing Rhythm

| Context | Value |
|---|---|
| Section vertical padding | `py-20` → `sm:py-24` → `lg:py-28` |
| Section horizontal padding | `px-4 sm:px-6 lg:px-8` |
| Max content width | `max-w-7xl mx-auto` |
| Gap between section header and content | `mt-14` |
| Column gap in two-column panels | `gap-0` (columns share borders) |
| Card/panel internal padding | `px-6 py-4` or `p-5` / `p-6` |
| Timeline step bottom padding | `pb-8` |

---

## 5. Component Library

### Shared UI (`src/components/ui/`)

| Component | File | Notes |
|---|---|---|
| Button | `button.tsx` | From `@base-ui/react`, CVA variants |
| Card | `card.tsx` | From shadcn |
| Badge | `badge.tsx` | From shadcn |
| Separator | `separator.tsx` | From shadcn |

### Page-Level Components (`src/components/`)

#### `SectionHeader`

Used at the top of every section. Renders a dot + monospace label, two-tone heading, and optional description.

```tsx
<SectionHeader
  label="How It Works"         // monospace dot + label above heading
  title="One bill received,"   // main heading text
  highlight="six steps to done." // muted continuation (new line on sm+)
  description="Optional body text below." // font-light, max-w-md
  align="left"                 // "left" (default) | "center"
/>
```

#### `FeatureCard`

Icon + title + description card. Circular bordered icon, hover border brightens.

```tsx
<FeatureCard
  icon={Bell}
  title="Configurable Reminders"
  description="Set reminders 3 days before due date..."
/>
```

Styles: `rounded-sm border border-border bg-muted/30 p-6 hover:border-foreground/20 hover:bg-muted/50`

Icon container: `size-12 rounded-full border border-border` → `group-hover:border-foreground/30`

---

## 6. Section Components (`src/components/sections/`)

### Navbar

Sticky, `bg-background/80 backdrop-blur-md`. Logo: `Receipt` icon + `font-mono font-medium tracking-[0.02em]` "BILLBOX". Nav links: monospace, `h-8.5`, share a border strip. CTA: split Button (Get started + LOGIN).

### Hero

Two-column `lg:grid-cols-2`. Left: dot label → H1 → body → split CTA → trust badges. Right: bill inbox mockup card (`rounded-sm border border-border bg-card`) with header, divided bill rows, footer summary, and a BillBox ID chip below.

### Problem

Two-column bordered panel (`border` left, `border border-l-0` right, `rounded-l-sm` / `rounded-r-sm`). Left: 6 pain-point questions with `↳ note` in `font-mono text-[11px]`. Right: 5 source tiles (Email, WhatsApp, Camera roll, etc.) + a dark anchor row at the bottom (`bg-foreground text-background`) showing BillBox as the resolution.

### How It Works (Lifecycle)

Same two-column bordered panel. Left: vertical timeline — `absolute left-5 w-px bg-border` connector line, circular icon nodes (`size-10 rounded-full`), zero-padded step numbers (`01 — Receive`), title, description, `↳ detail` hint. Right: contextual mock UI panels per step — bill row showing real status badges for that step.

### Features

Section header + `grid sm:grid-cols-2 lg:grid-cols-3 gap-4`. Uses `FeatureCard` for each feature.

### Bill Types

Section header + `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3`. Each tile: `rounded-sm border border-border bg-muted/30 p-5`, circular icon, monospace label.

### CTA

Centered. Dot label → H2 (single tone) → description → split CTA buttons. Background: `bg-background` (no special color).

### Footer

4-column grid: brand col + 3 link cols. Brand: `Receipt` icon + "BILLBOX" in `font-mono`. Column headings: `font-mono uppercase tracking-[0.08em]`. Bottom border + copyright in `font-mono text-xs`.

---

## 7. Patterns

### Dot + Label Section Marker

```tsx
<div className="mb-5 flex items-center gap-2">
  <span className="size-1.5 rounded-full bg-foreground/70" />
  <span className="font-mono text-xs tracking-[0.02em] text-muted-foreground">
    Section Name
  </span>
</div>
```

### Split Button CTA

```tsx
<div className="flex items-center gap-0">
  <a className="inline-flex h-9.5 items-center gap-1.5 rounded-l-sm border border-foreground bg-foreground px-4 font-mono text-[11px] font-semibold tracking-widest text-background hover:bg-foreground/90">
    PRIMARY ACTION <ArrowRight className="size-3" />
  </a>
  <a className="inline-flex h-9.5 items-center gap-1.5 rounded-r-sm border border-l-0 border-border bg-muted px-4 font-mono text-[11px] font-semibold tracking-widest text-foreground hover:bg-muted/80">
    SECONDARY <ArrowRight className="size-3" />
  </a>
</div>
```

### Two-Column Equal-Height Bordered Panel

```tsx
<div className="grid gap-0 lg:grid-cols-2">
  {/* Left */}
  <div className="flex flex-col border border-border rounded-l-sm">
    <div className="border-b border-border px-6 py-3.5">
      {/* panel header */}
    </div>
    <div className="flex flex-col divide-y divide-border flex-1">
      {rows.map(row => (
        <div key={row} className="flex flex-col flex-1 px-6 py-4">
          {/* row content */}
        </div>
      ))}
    </div>
  </div>
  {/* Right — shares left border */}
  <div className="flex flex-col border border-l-0 border-border rounded-r-sm">
    {/* mirror structure */}
  </div>
</div>
```

### Status Badge

For bill status labels inline in mock panels:

```tsx
// variant styles per status
pending:  "border-border bg-muted/50 text-muted-foreground"
unpaid:   "border-foreground/20 bg-foreground/5 text-foreground"
upcoming: "border-foreground/30 bg-foreground/8 text-foreground"
overdue:  "border-destructive/30 bg-destructive/10 text-destructive"
paid:     "border-foreground/20 bg-foreground/5 text-muted-foreground"

// Base classes
"inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-[10px] font-medium tracking-widest"
```

### Mock Panel Row

```tsx
<div className="flex items-start justify-between gap-4 py-2.5 border-b border-border last:border-0">
  <span className="text-xs text-muted-foreground shrink-0">{label}</span>
  <span className="text-xs font-medium text-foreground text-right">{value}</span>
</div>
```

### Icon Conventions

- Always `strokeWidth={1.5}` on lucide icons
- In circular containers: `size-4` or `size-4.5` (`size-[18px]`)
- In small inline contexts: `size-3` or `size-3.5`
- Brand icon: `Receipt` — used in Navbar, Footer, and Hero mockup

---

## 8. Hover & Interaction States

| Element | Hover |
|---|---|
| Section cards / tiles | `hover:border-foreground/20 hover:bg-muted/50` |
| Icon containers | `group-hover:border-foreground/30` |
| Timeline step nodes | `group-hover:border-foreground/30` |
| Bill inbox rows | `hover:bg-muted/40` |
| Nav links | `hover:bg-muted hover:text-foreground` |
| Footer links | `hover:text-foreground` |
| Split button (primary) | `hover:bg-foreground/90` |
| Split button (secondary) | `hover:bg-muted/80` |

All transitions: `transition-colors duration-300` or `transition-all`.

---

## 9. Accessibility

- Focus rings: `focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:border-ring` — from `@base-ui/react` primitives
- `@base-ui/react` handles keyboard navigation, ARIA, and focus management for all interactive primitives
- Never remove focus styles without replacement
- Disabled: `disabled:pointer-events-none disabled:opacity-50`
- Icons: always `aria-hidden="true"` when decorative (lucide handles this automatically)

---

## 10. File Structure

```
src/
├── app/
│   ├── globals.css          # Theme tokens (OKLCH CSS vars, @theme inline)
│   ├── icon.tsx             # Favicon — 32×32 Receipt icon on black bg
│   ├── layout.tsx           # Root layout, Geist fonts, metadata
│   └── page.tsx             # Composes all sections
├── components/
│   ├── ui/                  # shadcn primitives (button, card, badge, separator)
│   ├── section-header.tsx   # Dot label + two-tone heading + description
│   ├── feature-card.tsx     # Circular icon + title + description card
│   └── sections/
│       ├── navbar.tsx
│       ├── hero-section.tsx
│       ├── problem-section.tsx
│       ├── lifecycle-section.tsx
│       ├── features-section.tsx
│       ├── bill-types-section.tsx
│       ├── cta-section.tsx
│       └── footer.tsx
├── lib/
│   └── utils.ts             # re-exports cn() from "cn" package
docs/
├── design.md                # This file
└── PRD.md                   # Product requirements
```

---

## 11. Adding New Pages

When building new pages (dashboard, bill detail, settings, etc.):

1. Use `bg-background text-foreground` as the page root
2. Use `SectionHeader` for any page-level headings
3. Use `FeatureCard` for any icon + title + description tile layout
4. Use the two-column bordered panel pattern for side-by-side content
5. Use the split button pattern for all primary CTAs
6. Use `rounded-sm` — not `rounded-lg` — on all cards and panels
7. Icon containers: `rounded-full border border-border`, icon at `strokeWidth={1.5}`
8. Status labels: use the `StatusBadge` inline pattern from `lifecycle-section.tsx`
9. Always use `font-mono` for labels, IDs, step numbers, counts, and button text
10. Body copy: `font-light text-[15px] leading-[1.6] text-muted-foreground`

---

## References

- [shadcn/ui](https://ui.shadcn.com/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [@base-ui/react](https://base-ui.com)
- [lucide-react](https://lucide.dev)
- [Mosa AI (design inspiration)](https://mosa-ai-v1.21st.app/)
