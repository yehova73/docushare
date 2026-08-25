# DocFetch — Product & Marketing Description

> **One secure link. Clients upload everything. Files land in your Google Drive. You stop chasing.**

---

## What Is DocFetch?

DocFetch is a SaaS platform that removes the friction from collecting documents, files, and information from clients. Instead of managing a thread of follow-up emails, WhatsApp messages, and misplaced Drive folders, service businesses send one secure checklist link. The client works through it at their own pace — no account, no app, no friction. Automated reminders chase them so you don't have to. When everything is in, files are already organized in your Google Drive.

**Brand name:** DocFetch  
**Package / repo name:** docushare  
**Stage:** Early SaaS, pre-growth (v0.1.0 with production infrastructure in place)

---

## Target Customers

DocFetch is purpose-built for service professionals who collect materials from clients before work can begin:

| Vertical                    | Example use case                             |
| --------------------------- | -------------------------------------------- |
| Web & design agencies       | Brand assets, copy, domain access, photos    |
| Marketing agencies          | SEO onboarding, campaign briefs              |
| Accountants & tax preparers | Tax documents, W-2s, receipts, prior returns |
| Bookkeepers                 | Bank statements, expense records, invoices   |
| Mortgage brokers            | Application documents, ID, pay stubs         |
| HR consultants              | Employee onboarding paperwork                |
| Independent consultants     | Consulting kickoff materials                 |
| Freelancers (all types)     | Any client intake checklist                  |

**Primary pain point addressed:** Client material collection is the slowest part of any engagement — scattered across email, chat, and multiple storage folders — and it delays billing.

---

## How It Works (User Perspective)

### For the business (the DocFetch user)

1. **Build a checklist once** — Create a reusable template listing everything needed: files, images, text answers, links, questions. Mark items required or optional. Takes ~5 minutes.
2. **Send one link** — Paste it into your proposal, welcome email, or onboarding message. Pick a due date. Reminders go out automatically.
3. **Watch it fill in** — A live dashboard shows which items are in and which aren't. You get one notification when the request is complete. Files are already in your Drive folder.

### For the client (the recipient)

1. Opens the unique link — no signup, no password.
2. Works through the checklist at their own pace on any device.
3. Progress auto-saves. They can stop and resume later.
4. Receives automatic email reminders until outstanding items are submitted.

---

## Feature Inventory

### Core Workflow

- **Template builder** — Sections + fields with drag-and-drop reordering. Field types: short text, long text, email, phone, URL, number, file upload, image upload. Per-field settings: required flag, character limit, allow-multiple files, placeholder text, description.
- **Public template library** — Pre-built, categorized templates (Website Design, SEO Onboarding, Tax Preparation, Bookkeeping Setup, Mortgage Application, Employee Onboarding, Consulting Kickoff). One-click import and full editability.
- **Multi-step request wizard (stepper)** — Guided flow: select template → add clients → set deadlines → configure reminders → review & send. Supports draft state so setup can be paused and resumed.
- **Batch requests** — Send the same template to multiple clients in one flow. Each client gets their own independent assignment and portal link.
- **Request management** — Full CRUD dashboard with status filters (Draft, Assigned, In Progress, Completed, Overdue), client filters, and text search.

### Client Portal

- **No-login access** — Unique per-assignment URL. No account creation required.
- **Mobile-first design** — Optimized for phone browsers; most clients respond from their phone.
- **Auto-save** — Field values persist between sessions so partial completion is never lost.
- **Progress bar** — Visual per-section and overall completion indicator.
- **File uploads** — S3-backed with presigned URLs. Supports any file type. Multiple files per field.

### Automation & Communication

- **Automated email reminders** — Six configurable reminder types: assignment started, general reminder, due-soon warning, overdue notice, overdue follow-up, completion confirmation.
- **Reminder scheduling** — Two modes: _after X days_ (one-shot) and _every X days_ (repeating interval). All controlled per-assignment or globally.
- **Global → batch reminder cloning** — Global reminder presets are cloned per batch so per-assignment edits never touch the global defaults.
- **Configurable sender name & sending hour** — Reminders appear to come from your business name, sent at the hour you choose.
- **De-duplication** — `SentReminder` records prevent the same reminder firing twice for the same occurrence.

### Google Drive Integration

- **OAuth2 connection** — Connect once; access tokens are refreshed automatically.
- **Automatic folder structure** — On assignment creation, DocFetch creates `/Root/Template Name/Client Name/` folders in your Drive if they don't already exist.
- **Direct filing** — Every uploaded file is sent straight to the correct client sub-folder — no manual re-filing, no exporting.
- **Google Sheets tracking** — A companion spreadsheet is created per assignment for structured field-value tracking.
- **Non-destructive** — Disconnecting DocFetch leaves all Drive files exactly where they are.

### Branding & White-label

- **Full portal white-labeling** (Pro) — Logo upload, custom portal name, primary color, background color, header/footer color, field colors, border radius.
- **Preset themes** — One-click presets: Midnight, Slate, Ocean, Forest, and more.
- **Custom copy** — Editable welcome headline (with `{client name}`, `{user name}`, `{template name}` tokens) and post-submission message.
- **Client-facing portal** reflects branding with no DocFetch attribution.

### Dashboard & Analytics

- **Overview stats** — High-level counts (active requests, completed, overdue, clients).
- **Requests needing attention** — Prioritized list of stuck or overdue assignments, surfaced on the home page.
- **Recent activity feed** — Timeline of field updates and reminder sends.
- **Activity log** — Per-assignment log of every field change and reminder dispatch.
- **Progress counters** — `completedFieldsCount`, `completedSectionsCount`, `totalFieldsCount`, `totalRequiredFieldsCount` are denormalized on every assignment for fast rendering.

### Client Management

- **Client directory** — Add/edit/delete clients with name, company, email, phone.
- **Assignment history** — Each client record links to all their past and active assignments.

### Authentication & Account

- **Credential login** — Email + bcrypt-hashed password.
- **Magic link login** — Passwordless email sign-in.
- **OAuth** — Social login via NextAuth.js providers.
- **Email verification** — Tokens with expiry.
- **Password reset** — Secure token-based flow.
- **Email change** — Two-step verification flow (confirm old, verify new).
- **Account deletion** — Soft-delete with `deletedAt` timestamp; cascades are handled at the DB level.
- **Trial system** — 14-day free trial with `trialStartedAt` / `trialEndsAt` timestamps.

### Billing

- **Stripe integration** — Subscription management, webhooks for lifecycle events (started, changed, cancelled, past-due, payment failed).
- **Subscription statuses** — INACTIVE, ACTIVE, PAST_DUE, CANCELLED, PAYMENT_FAILED.
- **Feature access flags** — `UserFeatureAccess` table enables per-user feature gating independent of the plan.

### Settings

- **Notification preferences** — Toggle important notifications, marketing emails, and dev updates independently.
- **Reminder defaults** — Set global reminder templates that get cloned to every new batch.
- **Branding** — Full portal customization (described above).
- **Billing portal** — View plan, upgrade, cancel.

### Misc / Infrastructure

- **Quick-start onboarding** — Guided checklist of first actions (create template, add client, connect Drive, send first request).
- **In-app feedback** — Rating + category + free-text feedback tied to user account.
- **Contact form** — Public page for pre-signup inquiries; email sent via Brevo.
- **Email system** — React Email templates (Brevo as primary transactional provider, Nodemailer as fallback). Templates cover: welcome, magic link, password reset/confirmation, email change, reminder, subscription lifecycle, account deletion, contact/support receipts.
- **XLSX export** — `xlsx` package included for data export.
- **CSV import** — `papaparse` included for bulk data parsing.

---

## Tech Stack

| Layer             | Choice                                        |
| ----------------- | --------------------------------------------- |
| Framework         | Next.js 16 (App Router), React 19             |
| Language          | TypeScript                                    |
| Database          | PostgreSQL via Prisma ORM (v7)                |
| Auth              | NextAuth.js v4 + `@next-auth/prisma-adapter`  |
| File storage      | AWS S3 (presigned upload/download URLs)       |
| Drive integration | Google Drive API v3 (custom OAuth2 flow)      |
| Payments          | Stripe (subscriptions + webhooks)             |
| Email             | Brevo API + Nodemailer, React Email templates |
| UI                | Tailwind CSS v4, shadcn/ui, Radix UI, Base UI |
| Animations        | Framer Motion                                 |
| Drag and drop     | dnd-kit                                       |
| Tables            | TanStack Table v9                             |
| Charts            | Recharts                                      |
| Forms             | React Hook Form + Zod                         |
| Validation        | Zod                                           |
| Deployment target | Vercel (analytics included)                   |

---

## Pricing Model

| Plan    | Price       | Key limits                                                            |
| ------- | ----------- | --------------------------------------------------------------------- |
| Starter | $19 / month | Up to 15 active requests, 1 user, unlimited templates                 |
| Pro     | $49 / month | Unlimited requests, 5 team members, custom branding, priority support |

- 14-day free trial on both plans, no credit card required at signup.
- No per-client or per-request fees.

---

## Key Benefits

1. **Reduces intake time** — From ~11 days of back-and-forth to under 2 days on average.
2. **Eliminates manual follow-up** — Automated reminders replace every "just checking in" email.
3. **Zero friction for clients** — No account, no app, works on any device; adoption is near 100%.
4. **Files arrive organized** — Drive integration means zero post-collection filing work.
5. **Reusable workflows** — A template built once serves every future client in the same category.
6. **Centralized visibility** — One dashboard shows what is outstanding across all clients and projects.
7. **White-labeled** — Pro users can brand the portal so it looks like their own product.
8. **Owned data** — Files live in the user's own Google Drive; nothing is locked inside DocFetch.

---

## Competitive Positioning

DocFetch's closest named competitor visible in the codebase comparison is **Content Snare**. Other alternatives clients fall back on are email, Google Drive, and Google Forms.

| Capability                                     | DocFetch | Email   | Google Drive | Google Forms | Content Snare |
| ---------------------------------------------- | -------- | ------- | ------------ | ------------ | ------------- |
| Automatic reminders                            | ✅       | ✗       | ✗            | ✗            | ✅            |
| Files organized in _your_ Google Drive         | ✅       | ✗       | Partial      | ✗            | Partial       |
| No client login required                       | ✅       | ✅      | ✗            | ✅           | ✅            |
| Files + text + images + links in one checklist | ✅       | Partial | ✗            | Partial      | ✅            |
| Completion dashboard across clients            | ✅       | ✗       | ✗            | ✗            | ✅            |
| Set up in under 10 minutes                     | ✅       | ✅      | ✅           | ✅           | Partial       |

**DocFetch's strongest differentiator**: Google Drive direct-filing. Competitors either store files in their own silo or require manual export. DocFetch is the only option that lands files exactly where the user's workflow already expects them, with zero post-processing.

---

## What Can Be Improved

The following are product and technical gaps identified from the codebase. Each represents an opportunity to increase retention, expand the addressable market, or reduce churn.

### High priority

1. **Team workspace (multi-user)** — The Pro plan promises "5 team members" and "assign requests to owners," but no team/member data model exists in the schema yet. This is a significant gap between marketing claims and the actual product, and a blocker for selling to agencies.

2. **Stale subscription config copy** — `lib/subscriptions.ts` contains copy-pasted content referencing "browser workspaces" and "browser tabs," which has nothing to do with DocFetch. This would surface as wrong text anywhere it's rendered and should be replaced with the correct Starter/Pro feature lists.

3. **Client resubmission / rejection workflow** — There is no way for the business owner to reject a file and ask the client to resubmit. Businesses handling compliance-heavy documents (tax, mortgage) need this.

4. **Email branding** — Reminder and notification emails are plain-branded (currently "Tabzo" default). Custom branding only applies to the client portal, not to the emails themselves. Pro users expect outbound emails to carry their brand.

5. **File preview** — Uploaded files are filed to Drive but cannot be previewed inside the DocFetch dashboard. Users must navigate to Drive to verify quality, which defeats some of the centralization benefit.

### Medium priority

6. **Conditional / dependent fields** — No conditional logic in templates (e.g., "show this field only if the previous answer is Yes"). This is table stakes for tax and financial intake forms with many scenarios.

7. **Zapier / webhook integrations** — No outbound webhooks when requests are created, updated, or completed. A Zapier integration would unlock connections to project management tools (Asana, Notion, Monday), CRMs, and accounting software.

8. **Bulk client import** — `papaparse` is already a dependency but there is no CSV import UI for clients. Agencies migrating from other tools want to bulk-load their client list.

9. **Analytics dashboard** — Current metrics are operational (what's overdue). There is no historical analytics: average completion time, reminder effectiveness, completion rate by template. This data exists in the database but isn't surfaced.

10. **Request expiry / link invalidation** — Due dates exist, but there is no hard URL expiry mechanism. A security-conscious user (legal, finance) cannot auto-disable a portal link after a deadline.

### Lower priority / future differentiation

11. **E-signature** — Collecting a signed PDF back from a client is a common request in legal and financial verticals. Even a lightweight "I confirm this submission" checkbox could unlock those buyers.

12. **In-portal messaging** — No way for the client to ask a question or for the business to comment on a specific field. This drives support traffic back to email.

13. **Multi-language client portal** — The portal is English-only. Agencies serving multilingual client bases would benefit from configurable portal language.

14. **Native mobile app or PWA** — A PWA would improve the dashboard experience for business owners who manage requests on the go. Currently only the client-facing portal is mobile-optimized.

15. **SSO / SAML** — No enterprise single sign-on. Required to sell upmarket to firms with IT security policies.

16. **Template version history** — When a template is edited, previous versions are lost. Businesses that iterate on their intake process have no rollback capability.

17. **Audit trail / compliance export** — Activity logs exist but are not exportable in a format suitable for compliance review (e.g., GDPR data subject requests, audit logs for regulated industries).

---

## Summary

DocFetch is a focused, well-executed SaaS product solving a real and universal pain point for service businesses. The core loop — template → link → auto-reminder → Drive filing — is complete and compelling. The main growth levers are: shipping the team/multi-user feature to validate the Pro plan's promises, adding the Google Drive auto-sync to outbound emails (brand consistency), and building the first integration hook (webhook or Zapier) to make DocFetch a node in existing agency toolchains rather than a standalone tool.
