/*
  Warnings:

  - You are about to drop the column `category` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `uploadedBy` on the `Document` table. All the data in the column will be lost.
  - Added the required column `size` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "category",
DROP COLUMN "uploadedBy",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "size" INTEGER NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
