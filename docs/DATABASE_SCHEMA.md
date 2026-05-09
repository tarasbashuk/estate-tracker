# Estate Tracker Database Schema

This is the target MVP schema direction for Prisma/PostgreSQL. Adapt names/types to Prisma conventions during implementation.

## Global Rules

- Every user-owned entity must be scoped to `userId` where appropriate.
- Use `Decimal` for money and precision-sensitive numeric values.
- Use `DateTime @db.Date` for date-only fields where appropriate.
- `Payment` must be separate from `MonthlyStatement`.
- Do not use `paymentCategory = PARTIAL`.
- Partial payment status is derived from expected amount vs paid amount.
- `MonthlyStatement` must use flexible `MonthlyStatementItem` rows instead of hardcoded utility columns.
- Meters, meter readings, and reminders are part of MVP.

## Enums

```txt
Currency: UAH, USD, EUR
Language: ENG, UKR
PropertyType: APARTMENT, HOUSE, COMMERCIAL, OTHER
MessengerType: TELEGRAM, WHATSAPP, VIBER, EMAIL, PHONE, OTHER
AgreementStatus: DRAFT, ACTIVE, ENDED, CANCELLED
UtilityCategory: SYSTEM, CUSTOM
SubmissionMethod: WEBSITE, EMAIL, PHONE, MESSENGER, IN_PERSON, OTHER
MeterReadingStatus: WAITING_FOR_TENANT, RECEIVED_FROM_TENANT, SUBMITTED_TO_PROVIDER, NOT_REQUIRED
StatementStatus: DRAFT, READY_TO_SEND, SENT, CANCELLED
DerivedPaymentStatus: UNPAID, PARTIALLY_PAID, PAID, OVERPAID, OVERDUE
StatementItemType: RENT, UTILITY, CUSTOM, DISCOUNT, ADJUSTMENT
PaymentCategory: RENT, UTILITIES, DEPOSIT, MIXED, OTHER
PaymentMethod: BANK_TRANSFER, CASH, CARD, OTHER
ReminderType: REQUEST_METER_READINGS_FROM_TENANT, SUBMIT_METER_READINGS_TO_PROVIDER, RENT_PAYMENT_DUE, UTILITIES_PAYMENT_DUE, CUSTOM
ReminderStatus: OPEN, DONE, SKIPPED, CANCELLED
ExchangeRateSource: MANUAL, MONOBANK, NONE
```

Note: keep stored statement workflow status separate from derived payment status. The app can present one combined display status in UI.

## Models

### User

```txt
id
clerkUserId unique
email unique
firstName
lastName
fullName
imageUrl
createdAt
updatedAt
```

Relations:

- one `UserSettings`
- many properties, tenants, agreements, utility types, statements, reminders

### UserSettings

```txt
id
userId unique
language
defaultCurrency
defaultStatementDueDay
defaultMeterReadingReminderDay
ownerDisplayName
ownerEmail
ownerPhone
paymentInstructions
createdAt
updatedAt
```

### Property

```txt
id
userId
name
addressLine1
addressLine2
city
country
postalCode
area Decimal?
rooms Int?
propertyType
notes
isArchived Boolean
createdAt
updatedAt
```

Indexes:

- `userId`
- `userId, isArchived`

### Tenant

```txt
id
userId
fullName
phone
email
messengerType
messengerHandle
notes
isArchived Boolean
createdAt
updatedAt
```

Indexes:

- `userId`
- `userId, isArchived`

### RentalAgreement

```txt
id
userId
propertyId
tenantId
startDate
endDate
status
monthlyRentAmount Decimal
monthlyRentCurrency
paymentDueDay Int
depositAmount Decimal?
depositCurrency
notes
createdAt
updatedAt
```

Rules:

- enforce one active agreement per property at service level; add a database strategy if supported
- all property/tenant lookups must be scoped to the same `userId`

Indexes:

- `userId`
- `propertyId`
- `tenantId`
- `propertyId, status`

### UtilityType

```txt
id
userId nullable for system utilities
name
category
isSystem Boolean
createdAt
updatedAt
```

Rules:

- seed default system utility types
- custom utility types belong to a user

### PropertyUtilityConfig

```txt
id
userId
propertyId
utilityTypeId
isEnabled Boolean
defaultAmount Decimal?
defaultCurrency
notes
createdAt
updatedAt
```

Constraints:

- unique `propertyId, utilityTypeId`

### Meter

```txt
id
userId
propertyId
utilityTypeId
name
providerName
accountNumber
submissionMethod
submissionUrl
submissionEmail
submissionDayStart Int?
submissionDayEnd Int?
notes
isActive Boolean
createdAt
updatedAt
```

Indexes:

- `userId`
- `propertyId`
- `utilityTypeId`
- `propertyId, isActive`

### MeterReading

```txt
id
userId
meterId
propertyId
periodMonth Int
periodYear Int
previousValue Decimal?
currentValue Decimal?
consumption Decimal?
readingReceivedFromTenantAt DateTime?
submittedToProviderAt DateTime?
status
notes
createdAt
updatedAt
```

Constraints:

- unique `meterId, periodMonth, periodYear`

Rules:

- consumption can be calculated as current minus previous when both values exist
- readings can be marked `NOT_REQUIRED`

### MonthlyStatement

```txt
id
userId
propertyId
rentalAgreementId
tenantId
periodMonth Int
periodYear Int
rentAmount Decimal
rentCurrency
utilitiesAmount Decimal
totalAmount Decimal
totalCurrency
dueDate
status
sentAt DateTime?
exchangeRateSource
exchangeRateDate DateTime?
usdToUahRate Decimal?
eurToUahRate Decimal?
notes
createdAt
updatedAt
```

Constraints:

- unique `rentalAgreementId, periodMonth, periodYear`

Rules:

- rent and total fields are summary/snapshot values
- detailed rows live in `MonthlyStatementItem`
- payment status should be derived by summing related payments
- keep `CANCELLED` as stored workflow status

### MonthlyStatementItem

```txt
id
userId
statementId
utilityTypeId nullable
itemType
label
amount Decimal
currency
notes
sortOrder Int
createdAt
updatedAt
```

Rules:

- required for rent and utilities
- `DISCOUNT` can be stored as a negative amount or handled consistently by calculator
- items are the source for PDF charge rows

### Payment

```txt
id
userId
statementId
propertyId
tenantId
rentalAgreementId
amount Decimal
currency
paymentDate
paymentCategory
paymentMethod
notes
createdAt
updatedAt
```

Rules:

- no `PARTIAL` category
- partial, paid, overpaid, and overdue states are derived
- multiple payments per statement are allowed
- payment allocation by item can be added later; MVP uses category totals

Indexes:

- `userId`
- `statementId`
- `propertyId`
- `tenantId`
- `paymentDate`

### Reminder

```txt
id
userId
propertyId nullable
tenantId nullable
statementId nullable
meterId nullable
type
title
description
dueDate
status
completedAt DateTime?
createdAt
updatedAt
```

Rules:

- reminders are internal tasks in MVP
- no automatic email/messenger sending in MVP
- dashboard shows open and overdue reminders

## Derived Calculations

### Statement Totals

- `rentTotal`: sum statement items where `itemType = RENT`
- `utilitiesTotal`: sum statement items where `itemType = UTILITY`
- `grandTotal`: sum all statement items, respecting discounts/adjustments

### Payment Totals

- `paidTotal`: sum payments for statement
- `rentPaidTotal`: sum payments with category `RENT` plus any explicit mixed allocation later
- `utilitiesPaidTotal`: sum payments with category `UTILITIES` plus any explicit mixed allocation later
- `remainingBalance`: statement total minus paid total

### Derived Payment Status

- `UNPAID`: paid total equals 0 and due date has not passed
- `PARTIALLY_PAID`: paid total is greater than 0 and less than total amount
- `PAID`: paid total equals total amount
- `OVERPAID`: paid total is greater than total amount
- `OVERDUE`: due date has passed and paid total is less than total amount

