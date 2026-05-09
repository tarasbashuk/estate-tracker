# Estate Tracker Implementation Plan

## Guiding Principles

- Implement in small vertical slices.
- Keep `PROJECT_SPEC.md` as the master source of truth.
- Use `ARCHITECTURE_REVIEW.md` for project structure and implementation style.
- Do not copy Expense Tracker business logic.
- Prefer simple MVP behavior over premature integrations.
- Add tests around calculations that affect money, status, and statement totals.

## Phase 1: Project Setup

1. Scaffold Next.js app with TypeScript.
2. Install Material UI, MUI X Date Pickers/Data Grid, Clerk, Prisma, Zod, React Hook Form, date-fns, decimal.js, and PDF library.
3. Configure TypeScript, linting, formatting, and path aliases.
4. Configure Prisma with PostgreSQL/Neon.
5. Add shared Prisma client.
6. Add Clerk provider and middleware.
7. Add `requireUser` helper and local user provisioning.
8. Add dashboard route group and base shell.

Deliverable: authenticated owner can sign in and see protected dashboard shell.

## Phase 2: Database Schema

1. Define enums.
2. Add `User` and `UserSettings`.
3. Add `Property`, `Tenant`, and `RentalAgreement`.
4. Add `UtilityType` and `PropertyUtilityConfig`.
5. Add `Meter` and `MeterReading`.
6. Add `MonthlyStatement` and `MonthlyStatementItem`.
7. Add `Payment`.
8. Add `Reminder`.
9. Add seed for system utility types.
10. Run initial migration.

Deliverable: initial Prisma schema and migration covering MVP entities.

## Phase 3: Properties

1. Add property Zod schema.
2. Add property service scoped by user.
3. Add server actions for create/update/archive/list.
4. Add properties list page.
5. Add create/edit property form.
6. Add property detail page shell with tabs.

Deliverable: owner can create and manage properties.

## Phase 4: Tenants

1. Add tenant Zod schema.
2. Add tenant service scoped by user.
3. Add server actions.
4. Add tenants list page.
5. Add create/edit tenant form.
6. Add tenant detail page.

Deliverable: owner can create and manage tenants.

## Phase 5: Rental Agreements

1. Add agreement Zod schema.
2. Add agreement service.
3. Enforce one active agreement per property.
4. Add create agreement flow from property page.
5. Allow selecting or creating tenant.
6. Show active agreement on property detail.
7. Show agreement history.

Deliverable: property can have one active agreement and historical agreements.

## Phase 6: Utility Configuration

1. Seed default utility types.
2. Add custom utility type flow.
3. Add property utility config service.
4. Add Utilities tab on property detail.
5. Enable/disable utilities per property.
6. Store default amount and notes.

Deliverable: each property has configurable utility rows for future statements.

## Phase 7: Meters And Readings

1. Add meter form and service.
2. Add Meters tab on property detail.
3. Add meter reading form.
4. Calculate consumption when possible.
5. Track reading received from tenant.
6. Track submitted to provider.
7. Show current month reading statuses.

Deliverable: owner can manage meters and monthly readings.

## Phase 8: Monthly Statements

1. Add statement item calculator.
2. Add statement create flow by property and period.
3. Prefill active agreement and tenant.
4. Create rent `MonthlyStatementItem`.
5. Prefill utility `MonthlyStatementItem` rows from enabled property utilities.
6. Allow custom, discount, and adjustment rows.
7. Calculate rent total, utilities total, grand total.
8. Add statement list and filters.
9. Add statement detail/editor.

Deliverable: owner can create flexible monthly statements without hardcoded utility columns.

## Phase 9: Payments

1. Add payment form and service.
2. Add multiple payments per statement.
3. Support categories `RENT`, `UTILITIES`, `DEPOSIT`, `MIXED`, `OTHER`.
4. Do not add `PARTIAL` payment category.
5. Derive paid amount, remaining balance, partial state, paid state, overpaid state, and overdue state.
6. Show payment history and totals on statement detail.
7. Add focused tests for payment status derivation.

Deliverable: owner can record separate and partial payments accurately.

## Phase 10: PDF And Copy Message

1. Create PDF template from stored statement data.
2. Add PDF route handler or server action.
3. Include property, tenant, period, due date, statement items, totals, and payment notes.
4. Add copy message generator.
5. Add copy-to-clipboard button in statement detail.

Deliverable: owner can produce tenant-facing PDF and message.

## Phase 11: Dashboard And Reminders

1. Add reminder service.
2. Generate simple reminders for meter readings and provider submissions.
3. Generate payment due reminders from statements.
4. Add reminders dashboard section.
5. Add mark done, skip, cancel actions.
6. Add protected cron route only if needed for recurring reminder generation.
7. Protect cron route with `CRON_SECRET`.

Deliverable: owner sees pending tasks and overdue work without relying on memory.

## Phase 12: Currency Rates

1. Add exchange rate source fields to statements.
2. Add manual exchange rate entry.
3. Add optional Monobank fetch only if mixed-currency workflow needs it.
4. Store rates on statement when used.
5. Add tests to ensure historical statements remain stable.

Deliverable: statements can support mixed currency without changing historical totals.

## Suggested First Vertical Slice

Start with:

- authenticated dashboard route
- property list page
- create property form
- property create/list server actions
- basic validation
- empty/loading/error states

Do not implement tenants, agreements, statements, or payments in the first slice.

