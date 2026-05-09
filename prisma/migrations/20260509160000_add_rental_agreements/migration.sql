-- CreateEnum
CREATE TYPE "AgreementStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ENDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('UAH', 'USD', 'EUR');

-- CreateTable
CREATE TABLE "RentalAgreement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "status" "AgreementStatus" NOT NULL DEFAULT 'ACTIVE',
    "monthlyRentAmount" DECIMAL(12,2) NOT NULL,
    "monthlyRentCurrency" "Currency" NOT NULL DEFAULT 'UAH',
    "paymentDueDay" INTEGER NOT NULL,
    "depositAmount" DECIMAL(12,2),
    "depositCurrency" "Currency" NOT NULL DEFAULT 'UAH',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentalAgreement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RentalAgreement_userId_idx" ON "RentalAgreement"("userId");

-- CreateIndex
CREATE INDEX "RentalAgreement_propertyId_idx" ON "RentalAgreement"("propertyId");

-- CreateIndex
CREATE INDEX "RentalAgreement_tenantId_idx" ON "RentalAgreement"("tenantId");

-- CreateIndex
CREATE INDEX "RentalAgreement_propertyId_status_idx" ON "RentalAgreement"("propertyId", "status");

-- AddForeignKey
ALTER TABLE "RentalAgreement" ADD CONSTRAINT "RentalAgreement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalAgreement" ADD CONSTRAINT "RentalAgreement_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalAgreement" ADD CONSTRAINT "RentalAgreement_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

