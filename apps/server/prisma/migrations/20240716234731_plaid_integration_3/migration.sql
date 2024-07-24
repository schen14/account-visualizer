/*
  Warnings:

  - A unique constraint covering the columns `[userId,itemId]` on the table `UserPlaidItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserPlaidItem_userId_itemId_key" ON "UserPlaidItem"("userId", "itemId");
