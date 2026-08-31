-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "amountCharged" DOUBLE PRECISION,
ADD COLUMN     "partnerId" TEXT;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "referredByPartnerId" TEXT;

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "referralCode" TEXT NOT NULL,
    "commissionPercent" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Partner_email_key" ON "Partner"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_referralCode_key" ON "Partner"("referralCode");

-- CreateIndex
CREATE INDEX "Application_partnerId_idx" ON "Application"("partnerId");

-- CreateIndex
CREATE INDEX "Customer_referredByPartnerId_idx" ON "Customer"("referredByPartnerId");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_referredByPartnerId_fkey" FOREIGN KEY ("referredByPartnerId") REFERENCES "Partner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE SET NULL ON UPDATE CASCADE;
