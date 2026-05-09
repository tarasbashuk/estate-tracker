-- CreateTable
CREATE TABLE "UtilityType" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UtilityType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyUtilityConfig" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "utilityTypeId" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "defaultAmount" DECIMAL(12,2),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyUtilityConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UtilityType_userId_idx" ON "UtilityType"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UtilityType_userId_name_key" ON "UtilityType"("userId", "name");

-- CreateIndex
CREATE INDEX "PropertyUtilityConfig_userId_idx" ON "PropertyUtilityConfig"("userId");

-- CreateIndex
CREATE INDEX "PropertyUtilityConfig_propertyId_idx" ON "PropertyUtilityConfig"("propertyId");

-- CreateIndex
CREATE INDEX "PropertyUtilityConfig_utilityTypeId_idx" ON "PropertyUtilityConfig"("utilityTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyUtilityConfig_propertyId_utilityTypeId_key" ON "PropertyUtilityConfig"("propertyId", "utilityTypeId");

-- AddForeignKey
ALTER TABLE "UtilityType" ADD CONSTRAINT "UtilityType_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyUtilityConfig" ADD CONSTRAINT "PropertyUtilityConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyUtilityConfig" ADD CONSTRAINT "PropertyUtilityConfig_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyUtilityConfig" ADD CONSTRAINT "PropertyUtilityConfig_utilityTypeId_fkey" FOREIGN KEY ("utilityTypeId") REFERENCES "UtilityType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
