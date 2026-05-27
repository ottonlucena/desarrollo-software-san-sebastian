/*
  Warnings:

  - A unique constraint covering the columns `[id,userId]` on the table `Affiliate` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Affiliate_id_userId_key" ON "Affiliate"("id", "userId");
