# Estate Tracker Agent Rules

## Source Of Truth

- `PROJECT_SPEC.md` is the master source of truth.
- `ARCHITECTURE_REVIEW.md` guides architecture, setup style, and reusable patterns from Expense Tracker.
- These docs split the master spec into implementation-ready references.
- If docs conflict, prefer `PROJECT_SPEC.md`, except where the latest user instruction is stricter.

## Work Style

- Do not implement the whole app in one step.
- Work in small, reviewable vertical slices.
- Do not implement code when the task asks only for planning or documentation.
- Prefer simple MVP decisions over over-engineering.
- Do not add paid third-party services without approval.
- Do not add future-scope integrations before the core MVP works.

## Architecture Rules

- Use Next.js App Router, TypeScript, Material UI, Clerk, Prisma, Neon PostgreSQL, Zod, and React Hook Form unless the user decides otherwise.
- Keep the app monolithic and feature-based.
- Keep business logic out of UI components where practical.
- Use server actions for form workflows and route handlers for cron/PDF when appropriate.
- Scope all user-owned data by user.
- Reuse Expense Tracker patterns for auth, Prisma setup, Material UI, routing, cron protection, and deployment.
- Do not copy expense-specific transaction/category/credit-card business logic.

## Database Rules

- Every user-owned entity must include or be reachable through `userId`.
- Use `Decimal`, not floating point, for money and precision-sensitive values.
- Model `Payment` as a separate entity from `MonthlyStatement`.
- Never use `paymentCategory = PARTIAL`.
- Partial payment status must be derived from expected amount vs paid amount.
- Use `MonthlyStatementItem` for flexible charge rows.
- Do not add hardcoded utility columns to `MonthlyStatement`.
- Meters, meter readings, and reminders are part of MVP.
- Store exchange rates on statements when exchange rates affect statement totals.
- Do not let historical statements change when current rates or utility config changes.

## Payment Rules

- Payment categories are `RENT`, `UTILITIES`, `DEPOSIT`, `MIXED`, and `OTHER`.
- Multiple payments per statement are allowed.
- Separate rent and utility payments must be supported.
- A payment is partial only by comparison against expected totals.
- Statement payment display status is derived from total amount, paid amount, and due date.

## Statement Rules

- Statements should use stored item rows for PDF and tenant message generation.
- Rent should be represented as a `MonthlyStatementItem` with item type `RENT`.
- Utilities should be represented as `MonthlyStatementItem` rows with item type `UTILITY`.
- Custom charges, discounts, and adjustments should also be item rows.
- Sent statements should remain stable and auditable.

## Reminder Rules

- Reminders are internal tasks in MVP.
- Do not send automatic email, Telegram, WhatsApp, or Viber messages in MVP.
- Provide copyable reminder templates.
- Support meter reading request reminders, provider submission reminders, rent due reminders, utility due reminders, and custom reminders.

## UI Rules

- Use Material UI.
- Build practical dashboard screens, not a marketing landing page.
- Prefer tables/data grids for dense lists.
- Use tabs on property detail for overview, agreements, utilities, meters, statements, payments, and reminders.
- Use clear status chips.
- Keep forms simple and validated.
- Optimize for desktop first while keeping layouts responsive.

## Validation And Testing Rules

- Use Zod schemas for server-side validation and client forms.
- Use React Hook Form for non-trivial forms.
- Validate authorization and ownership in every server action/service.
- Add focused tests for statement total calculation, payment status derivation, active agreement constraints, and meter reading consumption.

## MVP Discipline

Do not implement these until after the core MVP works and the user approves:

- automatic provider API integrations
- WhatsApp/Telegram/Viber sending
- OCR bill parsing
- bank transaction matching
- native mobile app
- tenant portal
- multi-user organization features
- advanced analytics
- document uploads
- automatic external email reminders

