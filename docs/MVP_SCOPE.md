# Estate Tracker MVP Scope

## In Scope

### Authentication And Layout

- Clerk sign-in
- Protected dashboard routes
- Local app `User` record linked to Clerk
- Responsive dashboard shell with navigation

### Properties

- Create, edit, list, view, archive/delete properties
- Store address, characteristics, notes, and archived state
- Show property detail as the main operational workspace

### Tenants

- Create, edit, list, view tenants
- Store phone, email, messenger preference, handle, notes, archived state
- Connect tenants to rental agreements

### Rental Agreements

- Create agreement from a property page
- Select or create tenant
- Store dates, monthly rent, currency, deposit, payment due day, notes
- Show current active agreement and history
- Enforce only one active agreement per property

### Utility Configuration

- Seed default utility types
- Allow custom utility types
- Enable/disable utility types per property
- Store optional default amount and notes
- Do not hardcode utilities as statement columns

### Meters And Meter Readings

- Create meters per property and utility type
- Store provider details, account number, submission method, submission URL/email, normal submission day range, notes
- Record monthly readings
- Track previous/current values and consumption
- Track reading received from tenant
- Track reading submitted to provider
- Track reading status

### Monthly Statements

- Create monthly statement for property, agreement, tenant, and period
- Prefill active agreement and rent row
- Prefill utility rows from enabled property utilities
- Allow manual utility and custom amount input
- Use flexible `MonthlyStatementItem` rows for rent, utilities, custom charges, discounts, and adjustments
- Calculate rent total, utilities total, grand total, paid amount, and remaining balance
- Generate PDF
- Copy tenant message

### Payments

- Model `Payment` as a separate entity from `MonthlyStatement`
- Support multiple payments per statement
- Support separate rent and utility payments
- Support partial payments naturally
- Do not use `paymentCategory = PARTIAL`
- Derive partial payment status from expected amount vs paid amount
- Show rent paid amount, utilities paid amount, total paid amount, and remaining balance

### Reminders And Tasks

- Include reminders in MVP
- Show reminders/tasks on dashboard
- Create automatic monthly tasks where simple and reliable
- Support manual completion/skipping
- Support tenant meter reading reminders
- Support provider meter reading submission reminders
- Support rent and utility payment due reminders
- Provide copyable reminder message templates
- Do not send automatic emails/messages in the first version

### PDF And Copy Message

- Generate a clean tenant-facing monthly statement PDF
- Include property, tenant, period, due date, charge rows, totals, and payment notes
- Generate a short copyable message summarizing rent, utilities, total, and due date

### Dashboard

- Active properties
- Active rental agreements
- Current month statements
- Unpaid, partially paid, overdue, and overpaid statements
- Pending meter readings
- Readings to submit to providers
- Expected, received, and outstanding income for the month
- Upcoming due dates and open reminders

## Out Of Scope For MVP

- Tenant portal
- Native mobile app
- WhatsApp, Telegram, or Viber sending
- Utility provider API integrations
- Bank matching
- OCR bill parsing
- Advanced analytics
- Document upload for contracts and bills
- Multi-user organization management
- Automatic email reminders
- Paid third-party services without approval

## Suggested MVP Order

1. Project setup, auth, database, dashboard shell.
2. Properties CRUD.
3. Tenants CRUD.
4. Rental agreements.
5. Utility types and property utility configuration.
6. Meters and meter readings.
7. Monthly statements and statement items.
8. Payments and derived status logic.
9. PDF and copy message.
10. Dashboard reminders/tasks.

