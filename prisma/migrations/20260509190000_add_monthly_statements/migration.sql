-- CreateEnum
CREATE TYPE "StatementStatus" AS ENUM ('DRAFT', 'READY_TO_SEND', 'SENT', 'CANCELLED');

-- CreateEnum
CREATE TYPE "StatementItemType" AS ENUM ('RENT', 'UTILITY', 'CUSTOM', 'DISCOUNT', 'ADJUSTMENT');

-- CreateTable
CREATE TABLE "MonthlyStatement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "rentalAgreementId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "periodMonth" INTEGER NOT NULL,
    "periodYear" INTEGER NOT NULL,
    "dueDate" DATE NOT NULL,
    "status" "StatementStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyStatement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyStatementItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "monthlyStatementId" TEXT NOT NULL,
    "utilityTypeId" TEXT,
    "itemType" "StatementItemType" NOT NULL,
    "label" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'UAH',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyStatementItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyStatement_propertyId_periodMonth_periodYear_key" ON "MonthlyStatement"("propertyId", "periodMonth", "periodYear");

-- CreateIndex
CREATE INDEX "MonthlyStatement_userId_idx" ON "MonthlyStatement"("userId");

-- CreateIndex
CREATE INDEX "MonthlyStatement_propertyId_idx" ON "MonthlyStatement"("propertyId");

-- CreateIndex
CREATE INDEX "MonthlyStatement_tenantId_idx" ON "MonthlyStatement"("tenantId");

-- CreateIndex
CREATE INDEX "MonthlyStatement_rentalAgreementId_idx" ON "MonthlyStatement"("rentalAgreementId");

-- CreateIndex
CREATE INDEX "MonthlyStatement_periodYear_periodMonth_idx" ON "MonthlyStatement"("periodYear", "periodMonth");

-- CreateIndex
CREATE INDEX "MonthlyStatementItem_userId_idx" ON "MonthlyStatementItem"("userId");

-- CreateIndex
CREATE INDEX "MonthlyStatementItem_monthlyStatementId_idx" ON "MonthlyStatementItem"("monthlyStatementId");

-- CreateIndex
CREATE INDEX "MonthlyStatementItem_utilityTypeId_idx" ON "MonthlyStatementItem"("utilityTypeId");

-- AddForeignKey
ALTER TABLE "MonthlyStatement" ADD CONSTRAINT "MonthlyStatement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyStatement" ADD CONSTRAINT "MonthlyStatement_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyStatement" ADD CONSTRAINT "MonthlyStatement_rentalAgreementId_fkey" FOREIGN KEY ("rentalAgreementId") REFERENCES "RentalAgreement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyStatement" ADD CONSTRAINT "MonthlyStatement_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyStatementItem" ADD CONSTRAINT "MonthlyStatementItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyStatementItem" ADD CONSTRAINT "MonthlyStatementItem_monthlyStatementId_fkey" FOREIGN KEY ("monthlyStatementId") REFERENCES "MonthlyStatement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyStatementItem" ADD CONSTRAINT "MonthlyStatementItem_utilityTypeId_fkey" FOREIGN KEY ("utilityTypeId") REFERENCES "UtilityType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
