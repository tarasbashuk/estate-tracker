-- CreateEnum
CREATE TYPE "MessengerType" AS ENUM ('TELEGRAM', 'WHATSAPP', 'VIBER', 'EMAIL', 'PHONE', 'OTHER');

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "messengerType" "MessengerType" NOT NULL DEFAULT 'OTHER',
    "messengerHandle" TEXT,
    "notes" TEXT,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Tenant_userId_idx" ON "Tenant"("userId");

-- CreateIndex
CREATE INDEX "Tenant_userId_isArchived_idx" ON "Tenant"("userId", "isArchived");

-- AddForeignKey
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

