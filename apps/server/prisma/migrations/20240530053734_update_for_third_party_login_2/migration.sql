/*
  Warnings:

  - You are about to drop the column `externalId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "externalId",
DROP COLUMN "provider";

-- CreateTable
CREATE TABLE "ThirdPartyUser" (
    "externalId" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ThirdPartyUser_pkey" PRIMARY KEY ("externalId","provider")
);

-- AddForeignKey
ALTER TABLE "ThirdPartyUser" ADD CONSTRAINT "ThirdPartyUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
