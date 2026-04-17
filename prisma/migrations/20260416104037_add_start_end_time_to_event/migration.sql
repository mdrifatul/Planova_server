/*
  Warnings:

  - You are about to drop the column `category` on the `event` table. All the data in the column will be lost.
  - The `currency` column on the `event` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `currency` column on the `payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'BDT', 'AED', 'EUR', 'GBP');

-- AlterTable
ALTER TABLE "event" DROP COLUMN "category",
ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "endTime" TEXT,
ADD COLUMN     "startTime" TEXT,
DROP COLUMN "currency",
ADD COLUMN     "currency" "Currency" DEFAULT 'USD';

-- AlterTable
ALTER TABLE "payment" DROP COLUMN "currency",
ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'USD';

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
