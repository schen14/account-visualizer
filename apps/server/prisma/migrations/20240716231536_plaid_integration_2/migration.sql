/*
  Warnings:

  - You are about to drop the column `itemid` on the `UserPlaidItem` table. All the data in the column will be lost.
  - Added the required column `itemId` to the `UserPlaidItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserPlaidItem" DROP COLUMN "itemid",
ADD COLUMN     "itemId" TEXT NOT NULL;
