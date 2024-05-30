-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "externalId" INTEGER,
ADD COLUMN     "provider" TEXT,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;
