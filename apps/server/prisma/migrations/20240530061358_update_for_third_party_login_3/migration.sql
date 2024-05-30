/*
  Warnings:

  - The primary key for the `ThirdPartyUser` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "ThirdPartyUser" DROP CONSTRAINT "ThirdPartyUser_pkey",
ALTER COLUMN "externalId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ThirdPartyUser_pkey" PRIMARY KEY ("externalId", "provider");
