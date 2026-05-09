# Estate Tracker Architecture Review

## Purpose

This review analyzes the adjacent Expense Tracker app as a reference implementation for Estate Tracker. Expense Tracker is useful for setup patterns, authentication, database access, Material UI usage, routing, cron jobs, and deployment conventions, but Estate Tracker should not be implemented by copying expense-specific transaction logic.

Estate Tracker should start as a simple private MVP for one property owner/admin, while keeping the data model compatible with future multi-user ownership.

## Existing Expense Tracker Architecture Summary

Expense Tracker is a private Next.js application built with:

- Next.js App Router under `src/app`
- TypeScript
- Clerk authentication
- Prisma ORM
- PostgreSQL via `DATABASE_URL`, suitable for Neon
- Material UI 6 and MUI X components
- React context providers for settings, transactions, currencies, and i18n
- Server actions for most authenticated mutations and reads
- App Router route handlers for cron endpoints
- Vercel deployment with Vercel Cron
- Sentry instrumentation and route/global error boundaries
- Monobank currency-rate integration
- Nodemailer-based email reports

Important files and patterns:

- `src/app/layout.tsx`: global `ClerkProvider`, app providers, MUI baseline, header, mobile app bar, toast container, Vercel speed insights.
- `src/middleware.ts`: Clerk middleware with production `authorizedParties` based on `NEXT_PUBLIC_APP_URL`.
- `src/lib/db.ts`: shared Prisma client singleton in development.
- `prisma/schema.prisma`: Prisma schema with `User`, `Settings`, and `Transaction`.
- `src/lib/userUtils.ts`: Clerk user lookup, app-user provisioning, default settings creation, and dev/prod Clerk ID handling.
- `src/app/actions/*`: server actions for database reads/writes.
- `src/app/api/cron/*/route.ts`: cron route handlers protected by `CRON_SECRET`.
- `src/context/*`: server-loaded initial state passed into client providers.
- `src/components/*`: MUI-heavy UI with mobile-specific navigation.
- `src/lib/currenciesRate.utils.ts` and `src/lib/monobankRatesCache.ts`: currency conversion helpers and short-lived API cache.
- `src/app/error.tsx`, `src/app/global-error.tsx`, `src/instrumentation.ts`: Sentry-backed error capture.
- `vercel.json`: Vercel cron definitions.

## Reusable Patterns For Estate Tracker

### Authentication

Reuse the general Clerk approach:

- Mount `ClerkProvider` in the root layout.
- Use Clerk middleware globally.
- Use `currentUser()` or `auth()` in server-only code.
- Create an app-level `User` row on first authenticated access.
- Store Clerk's user ID on domain-owned rows through an owner/user relation.

Estate Tracker should keep the app private and redirect unauthenticated users away from dashboard pages. The MVP does not need roles or organizations.

### Database And ORM

Expense Tracker uses Prisma cleanly enough to reuse:

- `DATABASE_URL` from the environment.
- Prisma migrations under `prisma/migrations`.
- A shared Prisma client wrapper.
- `postinstall: prisma generate`.
- Server-only database access through actions/services.

For Estate Tracker, Prisma is the recommended ORM unless there is a strong later reason to switch to Drizzle. It is already proven in the reference app, works well with Neon, and is straightforward for a relational rental-management domain.

### App Router And Server Actions

Reuse the broad routing style:

- App Router pages for dashboard sections.
- Server components for initial auth checks and redirects.
- Server actions for form mutations and scoped reads.
- Route handlers for scheduled jobs or generated files where appropriate.

Estate Tracker can use server actions for CRUD and calculation workflows, and route handlers for PDF generation/downloads if server actions become awkward for binary responses.

### Material UI

Reuse MUI as the component system:

- `CssBaseline`
- MUI form controls
- MUI dialogs/modals
- MUI X Date Pickers
- MUI X Data Grid for dense statement/payment tables
- MUI icons for actions and navigation
- Responsive desktop/mobile navigation patterns

Estate Tracker should add an explicit `ThemeProvider` early. Expense Tracker uses MUI components but does not appear to centralize a custom theme; Estate Tracker will benefit from a quieter, operational dashboard theme from the start.

### Initial User Settings

The Expense Tracker `getOrCreateUser()` plus `Settings` initialization pattern is reusable:

- Create user on first authenticated visit.
- Create default settings in the same DB write.
- Load settings near the root layout.
- Provide settings to client components via context.

Estate Tracker settings should likely include:

- default currency
- locale/language
- default statement due day
- default utility reading reminder day
- owner display/contact details for PDFs

### Currency Integration

The Monobank integration is partially reusable:

- Keep a server-side currency-rate service.
- Cache API results for a short period.
- Represent money conversion explicitly.
- Avoid recalculating historical records silently.

Estate Tracker should probably need less currency complexity for MVP. Use it only if rental agreements or utility bills can be in different currencies. Store original amount/currency and calculated statement amount/currency separately.

### Cron And Reminders

The Vercel Cron pattern is reusable:

- Route handlers under `src/app/api/cron/...`.
- Bearer token protection with `CRON_SECRET`.
- `vercel.json` cron schedule.
- Sentry/log capture around scheduled work.

For Estate Tracker MVP, cron jobs can create reminder records or mark items as needing attention. Automatic WhatsApp/Telegram/email sending should not be added without explicit approval.

### Error Handling

Reusable pieces:

- Local try/catch in server actions.
- Return `{ data, error }`-style results for client forms.
- Route/global error boundaries.
- Optional Sentry integration if the user wants to keep using it.

For MVP, Sentry is useful because it is already familiar from Expense Tracker, but it is a third-party service. Do not add it to Estate Tracker unless the user confirms they want it.

### Deployment

Reusable deployment assumptions:

- Vercel-hosted Next.js app.
- Neon PostgreSQL.
- Clerk environment variables.
- Prisma generate during install.
- Vercel Cron for scheduled tasks.

## Patterns That Should Not Be Reused Blindly

- Do not copy transaction/category business logic. Estate Tracker has properties, tenants, agreements, utility meters, statements, and payments, not generic income/expense transactions.
- Do not reuse the credit-card mirror transaction flow. It is specific to personal finance and would add confusion.
- Do not rely only on ad hoc form validation. Estate Tracker should use schema validation because incorrect rental statements and payments are higher-risk than personal transaction entries.
- Do not store financial amounts as `Float`. Use `Decimal` in Prisma/PostgreSQL for rent, utility compensation, payments, balances, meter prices, and currency conversions.
- Do not spread database queries directly across UI components as the app grows. Estate Tracker should introduce feature services/repositories earlier.
- Do not force all pages to `dynamic = 'force-dynamic'` by default. Use it where auth/user-specific data requires it.
- Do not copy the current global provider shape exactly. Loading currencies and all settings at the root can make every page pay for data it may not need.
- Do not show raw serialized errors in production UI. Expense Tracker error boundaries currently display `JSON.stringify(error)`, which is useful during development but too leaky for production.
- Do not use disabled encryption toggles or custom client-side encryption until there is a clear security design. Rental data is sensitive, but partial encryption can create false confidence and complicate reporting.
- Do not add automatic email, Telegram, WhatsApp, OCR, bank matching, or utility-provider integrations in MVP.
- Do not use hard-coded year lists. Estate Tracker should derive date ranges from statements/agreements or generate year options dynamically.

## Recommended Estate Tracker Architecture

### High-Level Shape

Build Estate Tracker as a monolithic Next.js app with feature-based organization:

- Dashboard-first private app.
- Clerk authentication.
- Prisma + Neon PostgreSQL.
- Material UI for dense operational screens.
- Server actions for CRUD and calculation commands.
- Server-side services for business logic.
- Route handlers for cron and PDF downloads.
- Zod schemas shared by server actions and client forms.
- React Hook Form for non-trivial forms.

Keep the MVP boring and durable: authenticated owner, structured data, reliable monthly statement calculation, clear payment status, and downloadable PDFs.

### Suggested Tech Stack

- Next.js App Router
- TypeScript
- Clerk
- Neon PostgreSQL
- Prisma
- Material UI and MUI X Date Pickers/Data Grid
- Zod
- React Hook Form
- date-fns
- decimal.js
- PDF library: start with `@react-pdf/renderer` unless a visual HTML-to-PDF requirement emerges
- Optional later: Sentry, only with approval
- Optional later: Monobank currency rates, only if mixed-currency flows are confirmed

## Recommended Folder Structure

```txt
src/
  app/
    (public)/
      page.tsx
    (dashboard)/
      layout.tsx
      page.tsx
      properties/
        page.tsx
        [propertyId]/
          page.tsx
      tenants/
        page.tsx
      agreements/
        page.tsx
      statements/
        page.tsx
        [statementId]/
          page.tsx
      payments/
        page.tsx
      reminders/
        page.tsx
      settings/
        page.tsx
    actions/
      properties.ts
      tenants.ts
      agreements.ts
      statements.ts
      payments.ts
      reminders.ts
      settings.ts
    api/
      cron/
        reminders/
          route.ts
      statements/
        [statementId]/
          pdf/
            route.ts
    error.tsx
    global-error.tsx
    layout.tsx
    globals.css

  components/
    layout/
      DashboardShell.tsx
      DesktopNav.tsx
      MobileNav.tsx
    forms/
      FormTextField.tsx
      FormDatePicker.tsx
      FormMoneyField.tsx
    feedback/
      ConfirmDialog.tsx
      EmptyState.tsx
    data-display/
      StatusChip.tsx
      Money.tsx

  features/
    properties/
      components/
      schemas.ts
      service.ts
      types.ts
    tenants/
      components/
      schemas.ts
      service.ts
      types.ts
    agreements/
      components/
      schemas.ts
      service.ts
      types.ts
    utilities/
      components/
      schemas.ts
      service.ts
      types.ts
    meters/
      components/
      schemas.ts
      service.ts
      types.ts
    statements/
      components/
      calculator.ts
      schemas.ts
      service.ts
      types.ts
    payments/
      components/
      schemas.ts
      service.ts
      types.ts
    reminders/
      service.ts
      types.ts
    pdf/
      StatementPdf.tsx
      renderStatementPdf.ts
    currency/
      rates.ts
      money.ts

  server/
    db.ts
    auth.ts
    requireUser.ts

  lib/
    dates.ts
    errors.ts
    formatters.ts
    validation.ts
```

This structure keeps domain behavior close to each feature while preserving shared primitives for layout, formatting, validation, auth, and database access.

## Recommended Data Model Direction

Use a relational model centered on the owner, property, rental agreement, monthly statement, and payment.

Suggested MVP entities:

- `User`: app user linked to Clerk.
- `UserSettings`: locale, default currency, statement defaults, owner details for PDFs.
- `Property`: address, label, notes, ownership by user.
- `Tenant`: contact details and notes, ownership by user.
- `RentalAgreement`: property, tenant, start/end dates, rent amount, currency, deposit, payment due day, status.
- `UtilityMeter`: property-level meter definition, type, unit, provider/name, active flag.
- `MeterReading`: meter, reading date/month, value, source/status.
- `MonthlyStatement`: property/agreement/month, rent, utilities, adjustments, total due, status.
- `StatementLineItem`: normalized rent/utilities/adjustments rows for auditability and PDF output.
- `Payment`: statement/agreement/property, amount, currency, paid date, method, notes.
- `Reminder`: type, due date, status, linked property/agreement/statement when applicable.

Use `Decimal` for all money and meter numeric values where precision matters. Use enums for statement status, payment status, agreement status, utility type, and reminder type.

## Routing Approach

Recommended MVP pages:

- `/`: private dashboard summary after sign-in, public guest/sign-in prompt otherwise.
- `/properties`: property list and create action.
- `/properties/[propertyId]`: property detail with active agreement, meters, recent readings, statements, payments, reminders.
- `/tenants`: tenant list and contact management.
- `/agreements`: active/historical rental agreements.
- `/statements`: monthly statement list filtered by month/property/status.
- `/statements/[statementId]`: statement detail, line items, payment status, PDF action.
- `/payments`: payments list and reconciliation view.
- `/reminders`: action list for meter readings, statement generation, unpaid/overdue items.
- `/settings`: owner profile, default currency, locale, reminder defaults.

Use a dashboard route group so private app layout and navigation are isolated from the root public layout.

## Form And Validation Approach

Expense Tracker uses local state and guard clauses. Estate Tracker should improve this:

- Use Zod schemas per feature.
- Use React Hook Form for create/edit forms.
- Validate again inside server actions using the same schemas.
- Return typed action results such as `{ ok: true, data }` or `{ ok: false, fieldErrors, formError }`.
- Keep server-side authorization checks inside every action/service.
- Use MUI dialogs for create/edit forms where the workflow is short.
- Use full pages for complex workflows such as statement review and utility calculations.

Start with simple validations:

- required names/address fields
- positive money values
- date ordering for agreements
- one active agreement per property
- statement month uniqueness per agreement
- payment amount greater than zero
- meter readings non-negative and chronologically sensible

## Server Actions And Services

Recommended split:

- Server actions parse form input, check auth, call services, revalidate paths.
- Feature services perform business logic and database writes.
- PDF and cron route handlers call the same services rather than duplicating logic.

Example action/service boundaries:

- `features/properties/service.ts`: property CRUD scoped to current user.
- `features/statements/calculator.ts`: pure statement calculation from agreement, readings, utility config, and adjustments.
- `features/statements/service.ts`: create/update/finalize statement, persist line items, compute statuses.
- `features/payments/service.ts`: record payment, update statement payment status.
- `features/reminders/service.ts`: generate and resolve reminders.

## Environment Variables

Expected MVP variables:

```txt
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_APP_URL=
CRON_SECRET=
```

Optional only with approval:

```txt
SENTRY_DSN=
SENTRY_AUTH_TOKEN=
APP_EMAIL=
APP_EMAIL_PASS=
```

Do not add paid or external delivery services for reminders/PDF sending without asking first.

## Setup Steps

1. Scaffold a Next.js TypeScript app in the Estate Tracker workspace.
2. Install core dependencies: Clerk, Prisma, `@prisma/client`, Material UI, Emotion, MUI X date pickers/data grid, Zod, React Hook Form, date-fns, decimal.js, PDF library.
3. Configure Prisma with PostgreSQL and `DATABASE_URL`.
4. Add Clerk provider and middleware.
5. Add shared `db`, `requireUser`, and app-user provisioning.
6. Define the first Prisma schema around users, settings, properties, tenants, agreements, meters, statements, line items, payments, and reminders.
7. Run the initial migration against Neon or local PostgreSQL.
8. Add dashboard shell and navigation.
9. Implement CRUD features in thin vertical slices: properties, tenants, agreements, meters, readings.
10. Implement monthly statement calculation and persistence.
11. Implement payment tracking and statuses.
12. Implement PDF generation for statements.
13. Add reminder generation and a protected cron route.
14. Add focused tests for pure statement calculation and payment-status logic.

## Implementation Risks

- Money precision: using floating point values would cause avoidable balance and rounding issues. Use decimals.
- Statement recalculation: once a statement is sent to a tenant, changes should be explicit. Store line items and snapshots instead of only deriving live totals.
- Partial payments: model payments separately from statements so underpaid, overpaid, unpaid, and paid states are traceable.
- Meter readings: utility compensation may need previous/current readings, rates, fixed fees, and manual adjustments. Keep the calculator explicit and auditable.
- Multi-currency: decide early whether rent, utility bills, and payments can differ by currency. Avoid silent conversion of historical statements.
- Authorization: every query must be scoped to the current user, even in server actions and route handlers.
- PDF output: generated summaries must match stored statement data, not recalculate from mutable source records.
- Reminders: start with internal reminder records and dashboard badges before adding external notifications.
- Cron security: protect all scheduled routes with `CRON_SECRET`.
- Data migration from Excel: importing historical data can become a separate project. MVP should support manual entry first unless import is explicitly prioritized.
- Error visibility: do not leak raw server errors to the UI in production.
- App complexity: resist building a tenant portal, provider integrations, or bank matching before the core monthly workflow is stable.

## Open Questions

- Is the MVP strictly single-user, or should the schema include an `ownerId` everywhere from day one for future multi-user support? Recommendation: include `ownerId` from day one.
- Which currencies are actually needed for rent, utilities, and payments?
- Are rent and utilities usually billed in the same currency?
- Should utility compensation be calculated from meter readings, uploaded bill totals, fixed monthly values, or a mix?
- Which meter types are needed first: electricity, water, gas, heating, internet, building maintenance?
- Should statements be editable after being marked as sent, or should edits create revisions?
- What exact tenant PDF summary format replaces the Excel workflow?
- Do tenants pay one combined amount or separate rent and utilities?
- Are partial payments common?
- Should reminders be only in-app for MVP, or should email be considered later?
- Is Sentry desired for Estate Tracker, or should the MVP avoid that extra service?
- Is historical Excel import required before daily use can start?

## Practical MVP Recommendation

Build the first version around one reliable monthly loop:

1. Maintain properties and tenants.
2. Create active rental agreements.
3. Record meter readings and manual utility adjustments.
4. Generate a monthly statement with stored line items.
5. Download a PDF summary for the tenant.
6. Record payments against the statement.
7. Show dashboard reminders for missing readings, unsent statements, and unpaid/overdue balances.

This is the smallest architecture that replaces the Excel workflow without pulling the app into premature integrations.
