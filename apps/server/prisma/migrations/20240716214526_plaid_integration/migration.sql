-- CreateTable
CREATE TABLE "UserPlaidItem" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "accessToken" TEXT NOT NULL,
    "itemid" TEXT NOT NULL,

    CONSTRAINT "UserPlaidItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserPlaidItem" ADD CONSTRAINT "UserPlaidItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
