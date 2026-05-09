-- CreateEnum
CREATE TYPE "ReminderType" AS ENUM ('REQUEST_METER_READINGS_FROM_TENANT', 'SUBMIT_METER_READINGS_TO_PROVIDER', 'RENT_PAYMENT_DUE', 'UTILITIES_PAYMENT_DUE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM ('OPEN', 'DONE', 'SKIPPED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT,
    "tenantId" TEXT,
    "monthlyStatementId" TEXT,
    "meterId" TEXT,
    "type" "ReminderType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" DATE NOT NULL,
    "status" "ReminderStatus" NOT NULL DEFAULT 'OPEN',
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Reminder_userId_idx" ON "Reminder"("userId");

-- CreateIndex
CREATE INDEX "Reminder_propertyId_idx" ON "Reminder"("propertyId");

-- CreateIndex
CREATE INDEX "Reminder_tenantId_idx" ON "Reminder"("tenantId");

-- CreateIndex
CREATE INDEX "Reminder_monthlyStatementId_idx" ON "Reminder"("monthlyStatementId");

-- CreateIndex
CREATE INDEX "Reminder_meterId_idx" ON "Reminder"("meterId");

-- CreateIndex
CREATE INDEX "Reminder_status_dueDate_idx" ON "Reminder"("status", "dueDate");

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_monthlyStatementId_fkey" FOREIGN KEY ("monthlyStatementId") REFERENCES "MonthlyStatement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_meterId_fkey" FOREIGN KEY ("meterId") REFERENCES "Meter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
