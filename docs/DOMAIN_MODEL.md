# Estate Tracker Domain Model

## Core Entities

### User

The authenticated owner/admin linked to Clerk. Every user-owned entity should be scoped to a user to prevent cross-user data access and keep future multi-user support possible.

### UserSettings

Owner preferences and defaults:

- locale/language
- default currency
- default statement due day
- default meter reading reminder day
- owner display/contact details for PDFs

### Property

A managed rental object.

Key relationships:

- belongs to `User`
- has many `RentalAgreement`
- has many `PropertyUtilityConfig`
- has many `Meter`
- has many `MonthlyStatement`
- has many `Reminder`

### Tenant

A person or party renting a property.

Key relationships:

- belongs to `User`
- has many `RentalAgreement`
- has many `MonthlyStatement`
- has many `Payment`
- has many `Reminder`

### RentalAgreement

A rental contract between a property and tenant for a time period.

Rules:

- belongs to `User`, `Property`, and `Tenant`
- only one `ACTIVE` agreement may exist for a property at the same time
- supports historical agreements
- stores rent, currency, deposit, payment due day, dates, status, and notes

Statuses:

- `DRAFT`
- `ACTIVE`
- `ENDED`
- `CANCELLED`

### UtilityType

A system or custom utility/charge type.

Default examples:

- Electricity
- Cold water
- Hot water
- Heating
- Gas
- Internet
- Concierge
- Building maintenance
- Security
- Waste collection
- Other

Rent can appear as a statement item, but should not be configured like a normal property utility.

### PropertyUtilityConfig

Connects a utility type to a property and controls whether it is enabled for that property.

Fields include:

- enabled state
- optional default amount
- optional notes

### Meter

A utility meter or provider account connected to a property and utility type.

Fields include:

- provider name
- account number
- submission method
- submission URL/email
- normal submission day range
- notes
- active flag

Submission methods:

- `WEBSITE`
- `EMAIL`
- `PHONE`
- `MESSENGER`
- `IN_PERSON`
- `OTHER`

### MeterReading

A monthly reading for a meter.

Tracks:

- period month/year
- previous value
- current value
- consumption
- when reading was received from tenant
- when reading was submitted to provider
- status
- notes

Statuses:

- `WAITING_FOR_TENANT`
- `RECEIVED_FROM_TENANT`
- `SUBMITTED_TO_PROVIDER`
- `NOT_REQUIRED`

### MonthlyStatement

A monthly payment summary for a property, tenant, rental agreement, and period.

Important rules:

- Use `MonthlyStatementItem` rows for flexible charges.
- Do not hardcode utility columns.
- Store enough snapshot data to keep sent statements stable.
- Payment-related status may be derived dynamically.
- PDF output must use stored statement data, not recalculate from mutable source records.

Status concepts:

- `DRAFT`
- `READY_TO_SEND`
- `SENT`
- `UNPAID`
- `PARTIALLY_PAID`
- `PAID`
- `OVERPAID`
- `OVERDUE`
- `CANCELLED`

Derived status rules:

- `UNPAID`: paid amount is 0 and due date has not passed
- `PARTIALLY_PAID`: paid amount is greater than 0 and less than total amount
- `PAID`: paid amount equals total amount
- `OVERPAID`: paid amount is greater than total amount
- `OVERDUE`: due date passed and paid amount is less than total amount
- `CANCELLED`: statement should not be collected

### MonthlyStatementItem

An individual charge row in a statement.

Item types:

- `RENT`
- `UTILITY`
- `CUSTOM`
- `DISCOUNT`
- `ADJUSTMENT`

Examples:

- Rent
- Electricity
- Cold water
- Internet
- Concierge

This entity is required for MVP and is the primary way statements remain flexible.

### Payment

A real payment received from the tenant. Payments are separate entities from monthly statements.

Rules:

- one statement can have multiple payments
- rent and utilities can be paid separately
- partial payment is derived from expected amount vs paid amount
- never add `PARTIAL` as a payment category

Payment categories:

- `RENT`
- `UTILITIES`
- `DEPOSIT`
- `MIXED`
- `OTHER`

Payment methods:

- `BANK_TRANSFER`
- `CASH`
- `CARD`
- `OTHER`

### Reminder

A task/reminder for operational work.

Types:

- `REQUEST_METER_READINGS_FROM_TENANT`
- `SUBMIT_METER_READINGS_TO_PROVIDER`
- `RENT_PAYMENT_DUE`
- `UTILITIES_PAYMENT_DUE`
- `CUSTOM`

Statuses:

- `OPEN`
- `DONE`
- `SKIPPED`
- `CANCELLED`

## Money And Currency

Supported MVP currencies:

- `UAH`
- `USD`
- `EUR`

Rules:

- Use decimal values, not floats.
- Store original amount and currency.
- If exchange rates are used for a statement, store the source, date, and rates on the statement.
- Historical statements must not change when current exchange rates change.

Exchange rate sources:

- `MANUAL`
- `MONOBANK`
- `NONE`

