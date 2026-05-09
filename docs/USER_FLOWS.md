# Estate Tracker User Flows

## 1. Create Property

1. Owner opens Properties.
2. Owner clicks Add Property.
3. Owner enters address, characteristics, and notes.
4. Owner saves the property.
5. Property appears in the list.
6. Owner can open property details.

## 2. Configure Utilities

1. Owner opens property details.
2. Owner opens Utilities.
3. Owner enables the utilities used by this property.
4. Owner optionally adds a custom utility type.
5. Owner optionally sets default amounts or notes.
6. Owner saves the configuration.

## 3. Configure Meters

1. Owner opens property details.
2. Owner opens Meters.
3. Owner adds electricity, water, gas, or other meters.
4. Owner enters provider details and submission method.
5. Owner saves meter configuration.

## 4. Create Tenant

1. Owner opens Tenants or starts an agreement flow from property details.
2. Owner creates a tenant.
3. Owner enters contact and messenger information.
4. Owner saves the tenant.

## 5. Create Rental Agreement

1. Owner opens property details.
2. Owner clicks Create Rental Agreement.
3. Owner selects or creates a tenant.
4. Owner enters start/end dates, rent, currency, deposit, payment due day, and notes.
5. Owner saves the agreement.
6. Agreement becomes active.
7. App prevents a second active agreement for the same property.

## 6. Monthly Cycle

1. Dashboard shows meter reading reminders.
2. Owner copies reminder message and sends it to tenant manually.
3. Tenant sends readings through messenger/email/phone.
4. Owner enters readings in Estate Tracker.
5. Owner marks readings as received from tenant.
6. Owner submits readings to provider website/email/etc.
7. Owner marks readings as submitted to provider.
8. Owner receives or calculates utility amounts.
9. Owner creates monthly statement for property and period.
10. App prefills agreement, tenant, rent item, and enabled utility item rows.
11. Owner enters utility amounts and any adjustments.
12. App calculates totals.
13. Owner marks statement ready/sent when appropriate.
14. Owner generates PDF.
15. Owner copies tenant message and sends message/PDF manually.
16. Owner records payments as they arrive.
17. App derives payment progress and remaining balance.

## 7. Record Separate Rent And Utility Payments

1. Owner opens monthly statement.
2. Owner clicks Add Payment.
3. Owner records rent payment with category `RENT`.
4. Owner records utilities payment with category `UTILITIES`.
5. App shows rent paid amount, utilities paid amount, total paid amount, and remaining balance.
6. App derives statement status from totals and due date.

## 8. Partial Rent Payment

1. Expected rent is 18000 UAH.
2. Tenant pays 10000 UAH.
3. Owner records payment category `RENT`, amount 10000 UAH.
4. App shows rent remaining balance 8000 UAH.
5. Statement status becomes `PARTIALLY_PAID` because paid amount is greater than 0 and less than expected amount.
6. Tenant later pays 8000 UAH.
7. Owner records second `RENT` payment.
8. App shows rent as paid.

## 9. Overdue Payment

1. Statement due date passes.
2. Total paid amount is less than total statement amount.
3. App shows statement as `OVERDUE`.
4. Dashboard shows overdue reminder/task.
5. Owner can copy a follow-up message.

## 10. Copy Tenant Message

1. Owner opens finalized statement.
2. Owner clicks Copy Message.
3. App creates a concise message with period, rent total, utilities total, total due, and due date.
4. Owner sends it manually through preferred messenger or email.

## 11. Generate PDF

1. Owner opens statement.
2. Owner reviews statement items and totals.
3. Owner clicks Generate/Download PDF.
4. PDF includes property, tenant, period, due date, charge rows, totals, and payment notes.
5. Owner sends the PDF manually.

