/*
  Warnings:

  - You are about to drop the column `value` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `hash` on the `User` table. All the data in the column will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "AccountType" ADD VALUE 'OTHER';

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "value";

-- AlterTable
ALTER TABLE "Record" ALTER COLUMN "updatedBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "hash",
ADD COLUMN     "password" TEXT NOT NULL;
