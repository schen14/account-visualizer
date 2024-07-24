/*
  Warnings:

  - Changed the type of `accountType` on the `Account` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Record" DROP CONSTRAINT "Record_accountId_fkey";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "accountType",
ADD COLUMN     "accountType" TEXT NOT NULL;

-- DropEnum
DROP TYPE "AccountType";

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
