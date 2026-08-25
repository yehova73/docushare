# DocFetch — UI/UX Review

> Senior UI/UX audit. Issues are grouped by severity. File paths point to the root cause.

---

## 🔴 Critical — Broken or Wrong Content

### ~~1. Wrong SEO metadata (entire dashboard is mis-branded)~~

**File:** `app/(dashboard)/app/layout.tsx` ✅ **Fixed**

~~The `metadata` export describes **Tabzo** ("Freeze, Focus, and Restore Your Workspaces"), links to `tabzo.app`, and references Chrome tab management. This is copy-pasted from a different product entirely. Every dashboard page currently ships with Tabzo's title and Open Graph image to search engines and link previews.~~

~~**Fix:** Replace the metadata block with DocFetch's real title, description, and OG image.~~

---

### ~~2. "TabVault" and "TabVault .json" copy in Settings~~

**File:** `app/(dashboard)/app/settings/_components/settings-view.tsx` ✅ **Fixed**

~~The Data Portability section reads:~~

~~- _"Download a .json of all workspaces and settings."_~~
~~- Export filename: `tabvault-backup.json`~~
~~- _"Drag and drop a TabVault .json export to hydrate your local database."_~~

~~TabVault is a third product that has nothing to do with DocFetch. Clients reading the Settings page will be confused or lose trust.~~

~~**Fix:** Either rewrite this section for DocFetch's actual export format (clients, templates, requests) or remove it until it's implemented.~~

---

### 3. Orphaned component from "Percevo" (different product)

**File:** `components/_components/setup-checklist.tsx`

This component references:

- _"AI replies active — Percevo is generating responses automatically."_
- _"Add another location"_
- _"Manage multiple branches from one place."_

None of these are DocFetch concepts. The component also uses a hardcoded `bg-[#2B4ACF]` hex that is not in the DocFetch design token system. The component does not appear to be used in the current dashboard (which correctly uses `QuickStartContent` instead), but it pollutes the codebase and could be accidentally imported.

**Fix:** Delete `setup-checklist.tsx`.

---

### ~~4. Dead link in Quick Start~~

**File:** `app/(dashboard)/app/templates/_components/quick-start-content.tsx` ✅ **Fixed**

~~The _"Send your first request"_ action links to `"#"`. Clicking it does nothing. This is the final and most motivating step of the onboarding flow — a broken link here stalls user activation.~~

~~**Fix:** Link to `/app/new-assignation` or to a filtered requests view.~~

---

### ~~5. Missing CSS variable — `var(--indigo)`~~

**File:** `app/(dashboard)/app/settings/_components/settings-view.tsx` ✅ **Fixed**

~~`style={{ color: "var(--indigo)" }}` references a variable that is not defined anywhere in `globals.css` or the design token system. In production this renders as the browser's default color (black), silently breaking the intended style.~~

~~**Fix:** Replace with `var(--brand)` or `var(--primary)`.~~

---

## 🟠 High — Functional UX Problems

### ~~6. Client portal header badge is empty on mobile~~

**File:** `app/client-portal/[id]/_components/header.tsx` ✅ **Fixed**

~~Below the `sm` breakpoint the `<span>` is hidden but the `<Badge>` wrapper still renders — producing an empty pill with padding and a border.~~

~~**Fix:** Move the responsive logic to the Badge itself (`className="hidden sm:flex ..."`)~~

---

### ~~7. "Submit all documents" CTA is factually wrong~~

**File:** `app/client-portal/[id]/_components/client-portal.tsx` ✅ **Fixed** — changed to "Submit"

~~The submit button reads _"Submit all documents"_ even when the checklist contains text answers, email fields, URLs, or phone numbers.~~

---

### ~~8. Success receipt omits completed text fields~~

**File:** `app/client-portal/[id]/_components/success-view.tsx` ✅ **Fixed**

~~Only items with `status === "done"` appeared in the upload receipt, skipping all text/email/URL completions.~~

---

### ~~9. Sidebar top-level items never show as active~~

**File:** `components/sidebar/sidebar.tsx` ✅ **Fixed** — added `isActive={path === item.url}`

~~`SidebarMenuButton` wrapping non-collapsible items (Overview, Clients, Reminders) did not receive an `isActive` prop.~~

---

### ~~10. DRAFT, ASSIGNED, and IN_PROGRESS status badges are visually identical~~

**File:** `components/ui/request-status-badge.tsx` ✅ **Fixed** — DRAFT now uses `bg-secondary text-secondary-foreground`

~~All three statuses rendered with the same amber style, making the dashboard status column meaningless.~~

---

### ~~11. Two competing status badge implementations~~

**Files:** `components/ui/request-status-badge.tsx` and `requests-needing-attention.tsx` ✅ **Fixed** — replaced with `<StatusBadge />`

~~`requests-needing-attention.tsx` rendered its own hardcoded badge classes instead of using the `StatusBadge` component.~~

---

## 🟡 Medium — Design Inconsistencies

### ~~12. Hardcoded Tailwind colors bypass the design token system~~

✅ **Fixed** — all instances replaced with `--success`, `--warn`, `--destructive` tokens

~~The project has a meticulous OKLCH design token system with semantic tokens (`--success`, `--warn`, `--destructive`). Multiple files ignored it and used raw Tailwind color classes.~~

---

### ~~13. Google Drive "Connected" badge is non-standard~~

**File:** `app/(dashboard)/app/settings/_components/settings-view.tsx` ✅ **Fixed** — uses `--success` token with `aria-hidden` dot

~~Used `bg-lime-100`/`text-lime-800` (raw Tailwind, light mode only) and a manual `<div>` status dot without `aria-hidden`.~~

---

### ~~14. Stepper breadcrumb uses `/` as separator~~

**File:** `app/(dashboard)/app/new-assignation/_components/new-assignation-stepper.tsx` ✅ **Fixed** — changed to `›`

~~Step navigation rendered as: `Clients / Template / Reminders / Deadlines / Review`. The slash separator is universally understood as a path delimiter.~~

---

### ~~15. `DashboardPageHeader` uses non-standard `cls` prop~~

**File:** `components/dashboard-page-header.tsx` ✅ **Fixed** — renamed to `className`

~~Using `cls` broke the pattern and prevented Tailwind IntelliSense from recognising the value.~~

---

### 16. `StatUI` uses Tailwind `!important` modifiers as a crutch

**File:** `components/ui/stats.tsx`

`className="gap-0 !py-4"`, `className="!px-4 !gap-0"` — the `!` prefix overrides Tailwind specificity. This is a signal that the `Card`/`CardHeader`/`CardContent` base styles are too opinionated and need to be overridden at every use site.

**Fix:** Adjust the default padding in `Card` or create a `compact` variant instead of scattering `!` overrides.

---

### ~~17. AccordionTrigger removes focus ring in the client portal~~

**File:** `app/client-portal/[id]/_components/client-portal.tsx` ✅ **Fixed** — removed `focus:ring-0`

~~`focus:ring-0` removed the visible keyboard focus indicator, harming accessibility for keyboard and switch-access users.~~

---

### ~~18. Quick Start action items have `hover:bg-accent` but completed items still receive hover styles~~

**File:** `app/(dashboard)/app/templates/_components/quick-start-content.tsx` ✅ **Fixed** — hover/cursor only applied when `!completed`

~~Completed items implied clickability via hover despite being already done.~~

---

### ~~19. Recent Activity timeline uses a magic offset for the dot~~

**File:** `app/(dashboard)/app/templates/_components/recent-activity.tsx` ✅ **Fixed** — restructured to use `pl-5` on parent with `-left-[11px]` anchored to consistent gutter

~~`-left-[15.5px]` was a magic pixel value that would misalign if parent padding changed.~~

---

## 🔵 Low — Code Quality / Minor UX

### ~~20. `console.log` in the stats component (server-side)~~

**File:** `app/(dashboard)/app/_components/stats.tsx` ✅ **Fixed**

~~This logged on the server for every page load by any user.~~

---

### ~~21. Empty root `className` on the client portal wrapper~~

**File:** `app/client-portal/[id]/_components/client-portal.tsx` ✅ **Fixed**

~~`<div className="">` — empty string class removed.~~

---

### ~~22. Sidebar has a large block of commented-out code~~

**File:** `components/sidebar/sidebar.tsx` ✅ **Fixed** (previous session)

~~Approximately 20 lines of commented-out `SidebarMenuItem` / `SidebarMenuSub` code were removed.~~

---

### ~~23. Sidebar `defaultOpen` reads a cookie then ignores it~~

**File:** `app/(dashboard)/app/layout.tsx` ✅ **Fixed** — `defaultOpen={sidebarCookie?.value !== "false"}`

~~The cookie was fetched but never applied; the user's sidebar preference was silently discarded.~~

---

### ~~24. `lastActivity.slice(0, 7)` after `take: 7`~~

**File:** `app/(dashboard)/app/templates/_components/recent-activity.tsx` ✅ **Fixed** — redundant `.slice()` removed

~~The Prisma query already limited results to 7; the extra `.slice()` was misleading.~~

---

### ~~25. Unused state variables in `settings-view.tsx`~~

**File:** `app/(dashboard)/app/settings/_components/settings-view.tsx` ✅ **Fixed** (previous session)

~~`closePrev`, `freq`, `prefix` state declarations removed.~~

---

### ~~26. `templateId` filter in `RequestsTable` is unreachable~~

**File:** `app/(dashboard)/app/requests/_components/requests-table.tsx` ✅ **Fixed** — dead state and unused API param removed

~~`templateId` state was initialised to `undefined`, never set, and silently wired to the API call.~~

---

### ~~27. Avatar initials duplicated in the stepper~~

**Files:** `review-step.tsx` ✅ **Fixed** — now uses `getInitials()` from `lib/utils`

~~Inline `.split(" ").map(n => n[0]).join("")` replaced with the shared utility.~~

---

### ~~28. `<Link>` wrapped in a `<div>` for no reason~~

**Files:** `recent-activity.tsx`, `quick-start-content.tsx` ✅ **Fixed** — `key` moved to `<Link>` / `<React.Fragment>`, wrapper `<div>` removed

  <Link href={...}>...</Link>
</div>
```

The wrapping `<div>` serves no layout or styling purpose. It adds a stacking element to the DOM and pushes the `key` prop off the actual iterable element.

**Fix:** Apply `key` directly to `<Link>`.

---

## Summary Table

| #   | Severity    | Area          | Issue                                            | Status            |
| --- | ----------- | ------------- | ------------------------------------------------ | ----------------- |
| 1   | 🔴 Critical | Metadata      | ~~Dashboard has Tabzo SEO metadata~~             | ✅                |
| 2   | 🔴 Critical | Settings      | ~~TabVault copy in Data Portability section~~    | ✅                |
| 3   | 🔴 Critical | Components    | Orphaned Percevo `setup-checklist.tsx`           | ⏳ pending delete |
| 4   | 🔴 Critical | Quick Start   | ~~Dead `#` link on final onboarding step~~       | ✅                |
| 5   | 🔴 Critical | Settings      | ~~`var(--indigo)` CSS variable doesn't exist~~   | ✅                |
| 6   | 🟠 High     | Client Portal | ~~Empty badge rendered on mobile~~               | ✅                |
| 7   | 🟠 High     | Client Portal | ~~"Submit all documents" misleading CTA~~        | ✅                |
| 8   | 🟠 High     | Client Portal | ~~Success receipt skips text field completions~~ | ✅                |
| 9   | 🟠 High     | Sidebar       | ~~Top-level nav items never show active state~~  | ✅                |
| 10  | 🟠 High     | Status Badge  | ~~DRAFT/ASSIGNED/IN_PROGRESS look identical~~    | ✅                |
| 11  | 🟠 High     | Status Badge  | ~~Two competing badge implementations~~          | ✅                |
| 12  | 🟡 Medium   | Design System | ~~Raw Tailwind colors bypass token system~~      | ✅                |
| 13  | 🟡 Medium   | Settings      | ~~Drive "Connected" badge non-standard~~         | ✅                |
| 14  | 🟡 Medium   | Stepper       | ~~`/` breadcrumb separator looks like a path~~   | ✅                |
| 15  | 🟡 Medium   | Header        | ~~`cls` prop instead of `className`~~            | ✅                |
| 16  | 🟡 Medium   | Stats         | `!important` Tailwind overrides                  | ⏳ skipped        |
| 17  | 🟡 Medium   | Client Portal | ~~`focus:ring-0` breaks keyboard accessibility~~ | ✅                |
| 18  | 🟡 Medium   | Quick Start   | ~~Completed items still show hover/pointer~~     | ✅                |
| 19  | 🟡 Medium   | Activity      | ~~Magic pixel offset for timeline dot~~          | ✅                |
| 20  | 🔵 Low      | Stats         | ~~`console.log` left in production~~             | ✅                |
| 21  | 🔵 Low      | Client Portal | ~~Empty `className=""` attribute~~               | ✅                |
| 22  | 🔵 Low      | Sidebar       | ~~Large commented-out code block~~               | ✅                |
| 23  | 🔵 Low      | Layout        | ~~Sidebar cookie read but ignored~~              | ✅                |
| 24  | 🔵 Low      | Activity      | ~~Redundant `.slice(0, 7)` after `take: 7`~~     | ✅                |
| 25  | 🔵 Low      | Settings      | ~~Three unused state variables~~                 | ✅                |
| 26  | 🔵 Low      | Requests      | ~~`templateId` filter state is unreachable~~     | ✅                |
| 27  | 🔵 Low      | Stepper       | ~~Duplicate avatar initials logic~~              | ✅                |
| 28  | 🔵 Low      | Various       | ~~`<div>` wrapper around `<Link>`~~              | ✅                |
