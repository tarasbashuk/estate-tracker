-- CreateEnum
CREATE TYPE "SubmissionMethod" AS ENUM ('WEBSITE', 'EMAIL', 'PHONE', 'MESSENGER', 'IN_PERSON', 'OTHER');

-- CreateEnum
CREATE TYPE "MeterReadingStatus" AS ENUM ('WAITING_FOR_TENANT', 'RECEIVED_FROM_TENANT', 'SUBMITTED_TO_PROVIDER', 'NOT_REQUIRED');

-- CreateTable
CREATE TABLE "Meter" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "utilityTypeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "providerName" TEXT,
    "accountNumber" TEXT,
    "submissionMethod" "SubmissionMethod" NOT NULL DEFAULT 'OTHER',
    "submissionUrl" TEXT,
    "submissionEmail" TEXT,
    "submissionDayStart" INTEGER,
    "submissionDayEnd" INTEGER,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeterReading" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "meterId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "periodMonth" INTEGER NOT NULL,
    "periodYear" INTEGER NOT NULL,
    "previousValue" DECIMAL(12,3),
    "currentValue" DECIMAL(12,3),
    "consumption" DECIMAL(12,3),
    "readingReceivedFromTenantAt" TIMESTAMP(3),
    "submittedToProviderAt" TIMESTAMP(3),
    "status" "MeterReadingStatus" NOT NULL DEFAULT 'WAITING_FOR_TENANT',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MeterReading_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Meter_userId_idx" ON "Meter"("userId");

-- CreateIndex
CREATE INDEX "Meter_propertyId_idx" ON "Meter"("propertyId");

-- CreateIndex
CREATE INDEX "Meter_utilityTypeId_idx" ON "Meter"("utilityTypeId");

-- CreateIndex
CREATE INDEX "Meter_propertyId_isActive_idx" ON "Meter"("propertyId", "isActive");

-- CreateIndex
CREATE INDEX "MeterReading_userId_idx" ON "MeterReading"("userId");

-- CreateIndex
CREATE INDEX "MeterReading_propertyId_idx" ON "MeterReading"("propertyId");

-- CreateIndex
CREATE INDEX "MeterReading_meterId_idx" ON "MeterReading"("meterId");

-- CreateIndex
CREATE INDEX "MeterReading_periodYear_periodMonth_idx" ON "MeterReading"("periodYear", "periodMonth");

-- CreateIndex
CREATE UNIQUE INDEX "MeterReading_meterId_periodMonth_periodYear_key" ON "MeterReading"("meterId", "periodMonth", "periodYear");

-- AddForeignKey
ALTER TABLE "Meter" ADD CONSTRAINT "Meter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meter" ADD CONSTRAINT "Meter_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meter" ADD CONSTRAINT "Meter_utilityTypeId_fkey" FOREIGN KEY ("utilityTypeId") REFERENCES "UtilityType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeterReading" ADD CONSTRAINT "MeterReading_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeterReading" ADD CONSTRAINT "MeterReading_meterId_fkey" FOREIGN KEY ("meterId") REFERENCES "Meter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeterReading" ADD CONSTRAINT "MeterReading_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
