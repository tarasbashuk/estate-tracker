# Estate Tracker Product Brief

## Product

Estate Tracker is a private rental property management app for replacing an Excel-based workflow.

It helps the property owner/admin manage properties, tenants, rental agreements, meter readings, monthly rent, utility compensation, payment status, reminders, and PDF summaries for tenants.

## Primary User

The first user is the property owner/admin. The product is single-user-first, but the data model should include user ownership from the beginning so future multi-user support is not blocked.

## Problem

The current rental workflow is spread across Excel, messengers, emails, websites, and memory. The owner needs one reliable place to:

- track properties and active/historical tenants
- manage rental agreements
- request and record meter readings
- track whether readings were submitted to providers
- calculate monthly rent and utility compensation
- generate a clear tenant-facing monthly PDF
- copy a short tenant message for messenger/email
- record separate rent and utility payments
- understand unpaid, partially paid, overdue, and overpaid states
- see operational reminders and tasks

## MVP Goal

Replace the Excel workflow for rental payments, utility compensation, meter readings, payment status tracking, and monthly tenant summaries.

## MVP Success Criteria

The MVP is successful when the owner can:

1. Create a property.
2. Configure utilities and meters.
3. Add a tenant.
4. Add an active rental agreement.
5. Request and record meter readings.
6. Mark readings as submitted to providers.
7. Create a monthly statement with flexible line items.
8. Generate a PDF.
9. Copy a tenant message.
10. Record separate rent and utility payments.
11. Track partial payments from expected amount vs paid amount.
12. See pending tasks and overdue payment states on the dashboard.

## MVP Non-Goals

- Native mobile app
- Public tenant portal
- Multi-user organizations or role-based access control
- Automatic Telegram or WhatsApp sending
- Automatic utility provider integrations
- Automatic bank transaction matching
- OCR parsing of bills
- Complex accounting reports
- Subscription billing
- Paid third-party services without approval

## Architecture Direction

Use a monolithic Next.js app with feature-based organization:

- Next.js App Router
- TypeScript
- Material UI
- Clerk authentication
- Neon PostgreSQL
- Prisma
- Zod
- React Hook Form
- PDF generation library

Follow `ARCHITECTURE_REVIEW.md` for implementation style. Treat the existing Expense Tracker app as a reference for auth, database setup, Material UI usage, routing, and deployment patterns, not as a source for business-logic copy-paste.

